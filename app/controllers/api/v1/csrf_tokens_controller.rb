class Api::V1::CsrfTokensController < ApplicationController
  def index
    render json: { csrfToken: form_authenticity_token }
  end
end
