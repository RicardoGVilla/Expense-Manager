class AddPlaidAccessTokenToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :plaid_access_token, :string
  end
end
