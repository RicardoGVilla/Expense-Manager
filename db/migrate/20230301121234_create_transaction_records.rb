class CreateTransactionRecords < ActiveRecord::Migration[7.0]
  def change
    create_table :transaction_records do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :amount
      t.date :date
      t.string :merchant
      t.references :category, null: false, foreign_key: true

      t.timestamps
    end
  end
end
