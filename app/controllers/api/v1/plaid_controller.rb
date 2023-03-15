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
end
