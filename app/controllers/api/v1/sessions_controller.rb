class Api::V1::SessionsController < ApplicationController
  include Devise::Controllers::SignInOut
  require 'plaid'

  skip_before_action :verify_authenticity_token, only: [:create]

  def create
    user = User.find_by(email: params[:user][:email])

    if user.valid_password?(params[:user][:password])
      sign_in(:user, user)
      link_token_response = plaid_client.link_token_create(link_token_create_request(user.id))

      render json: { link_token: link_token_response.link_token, user_id: user.id }
    else
      Rails.logger.error "User authentication failed"
      render json: { success: false }
    end
  end

  def destroy
    session.delete(:user_id)
    render json: { message: "Successfully signed out" }
  end

  private

  def link_token_create_request(client_user_id)
    Plaid::LinkTokenCreateRequest.new(
      user: { client_user_id: client_user_id.to_s },
      client_name: 'My app',
      products: %w[auth transactions],
      country_codes: ['CA'],
      language: 'en'
    )
  end

  def plaid_client
    configuration = Plaid::Configuration.new
    configuration.server_index = Plaid::Configuration::Environment["sandbox"]
    configuration.api_key["PLAID-CLIENT-ID"] =  ENV['PLAID_CLIENT_ID']
    configuration.api_key["PLAID-SECRET"] = ENV['PLAID_SECRET']

    api_client = Plaid::ApiClient.new(configuration)
    Plaid::PlaidApi.new(api_client)
  end
end
