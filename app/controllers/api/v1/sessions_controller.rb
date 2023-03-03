class Api::V1::SessionsController < Devise::SessionsController
  skip_before_action :verify_authenticity_token

  def create
    self.resource = warden.authenticate!(auth_options)
    sign_in(resource_name, resource)
    render json: { message: 'Logged in successfully', user: current_user }
  end

  def destroy
    sign_out(resource_name)
    render json: { message: 'Logged out successfully' }
  end
end
