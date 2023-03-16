class Api::V1::PlaidController < ApplicationController
  PLAID_CLIENT_ID = ENV['PLAID_CLIENT_ID']
  PLAID_SECRET = ENV['PLAID_SECRET']
  PLAID_ENVIRONMENT = ENV['PLAID_ENVIRONMENT']

  require 'plaid'

  skip_before_action :verify_authenticity_token, only: [:create_client_token]

  def create_client_token
    configuration = Plaid::Configuration.new
    configuration.server_index = Plaid::Configuration::Environment['sandbox']
    configuration.api_key['PLAID-CLIENT-ID'] = ENV['PLAID_CLIENT_ID']
    configuration.api_key['PLAID-SECRET'] = ENV['PLAID_SECRET']

    api_client = Plaid::ApiClient.new(configuration)
    client = Plaid::PlaidApi.new(api_client)

    public_token = params[:public_token]
    exchange_request = Plaid::ItemPublicTokenExchangeRequest.new(public_token: public_token)
    exchange_response = client.item_public_token_exchange(exchange_request)
    access_token = exchange_response.access_token
    item_id = exchange_response.item_id

    current_user =  User.find(params[:user])

    current_user.update(
      plaid_access_token: access_token,
      plaid_item_id: item_id
    )

    render json: { client_token: access_token }
  rescue Plaid::PlaidError => e
    render json: { error: e.pretty_error }
  end

  def get_transactions
    access_token = params[:access_token]
    configuration = Plaid::Configuration.new
    configuration.server_index = Plaid::Configuration::Environment['sandbox']
    configuration.api_key['PLAID-CLIENT-ID'] = ENV['PLAID_CLIENT_ID']
    configuration.api_key['PLAID-SECRET'] = ENV['PLAID_SECRET']

    api_client = Plaid::ApiClient.new(configuration)
    client = Plaid::PlaidApi.new(api_client)

    transactions_get_request = Plaid::TransactionsGetRequest.new
    transactions_get_request.access_token = access_token
    transactions_get_request.start_date = (Date.today - 30).strftime('%Y-%m-%d')
    transactions_get_request.end_date = Date.today.strftime('%Y-%m-%d')

    transaction_response = client.transactions_get(transactions_get_request)
    transactions = transaction_response.transactions


    all_transactions = []

    while transactions.length < transaction_response.total_transactions
      options_payload = {}
      options_payload[:offset] = transactions.length

      transactions_get_request = Plaid::TransactionsGetRequest.new
      transactions_get_request.access_token = access_token
      transactions_get_request.start_date = "2020-01-01"
      transactions_get_request.end_date = "2021-01-01"
      transactions_get_request.options = options_payload

      transaction_response = client.transactions_get(transactions_get_request)
      transactions += transaction_response.transactions
    end

    render json: all_transactions.to_json
  end

end
