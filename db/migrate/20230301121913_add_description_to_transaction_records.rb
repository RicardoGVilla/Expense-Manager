class AddDescriptionToTransactionRecords < ActiveRecord::Migration[7.0]
  def change
    add_column :transaction_records, :description, :string
  end
end
