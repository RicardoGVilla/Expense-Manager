class Api::V1::SessionsController < ApplicationController
  include Devise::Controllers::SignInOut
  require 'plaid'



  skip_before_action :verify_authenticity_token, only: [:create]

  def create
    # logger.info "Request parameters: #{params.inspect}"
    # puts "CSRF token received: #{params[:authenticity_token]}"
    # request.env["devise.mapping"] = Devise.mappings[:user] # Added this line
    user = User.find_by(email: params[:user][:email])
    puts Gem.loaded_specs.key?('plaid')
    puts ENV['PLAID_CLIENT_ID']
    puts ENV['PLAID_SECRET']

    #authentication logic

    if user.valid_password?(params[:user][:password])
      sign_in(:user, user)
    # Set up Plaid API client
      configuration = Plaid::Configuration.new
      configuration.server_index = Plaid::Configuration::Environment["sandbox"]
      configuration.api_key["PLAID-CLIENT-ID"] =  ENV['PLAID_CLIENT_ID']
      configuration.api_key["PLAID-SECRET"] = ENV['PLAID_SECRET']

      api_client = Plaid::ApiClient.new(
        configuration
      )

      client = Plaid::PlaidApi.new(api_client)

      # Grab the client_user_id by searching for the current user in your database
      client_user_id = user.id

      # Create the link_token with all of your configurations
      link_token_create_request = Plaid::LinkTokenCreateRequest.new({
        :user => { :client_user_id => client_user_id.to_s },
        :client_name => 'My app',
        :products => %w[auth transactions],
        :country_codes => ['CA'],
        :language => 'en'
      })

      link_token_response = client.link_token_create(
        link_token_create_request
      )

      # Pass the result to your client-side app to initialize Link
      #  and retrieve a public_token
      link_token = link_token_response.link_token

      # Return the Link token to the front-end
      render json: { link_token: link_token_response.link_token, user_id: client_user_id}
    else
      puts "User authentication failed"
      render json: { success: false }
    end
  end

  def destroy
    session.delete(:user_id)
    render json: { message: "Successfully signed out" }
  end
end
