class AddPlaidItemIdToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :plaid_item_id, :string
  end
end
