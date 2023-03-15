Rails.application.routes.draw do
  devise_for :users, controllers: { sessions: 'api/v1/sessions' }

  namespace :api do
    namespace :v1 do
      get '/csrf_token', to: 'csrf_tokens#index'
      post '/plaid/create_client_token', to: 'plaid#create_client_token'
    end
  end
end
