class CreateContents < ActiveRecord::Migration
  def change
    create_table :contents do |t|
      t.string :tagname
      t.text :content
      t.references :page, index: true, foreign_key: true

      t.timestamps null: false
    end
    add_index :contents, [:page_id, :created_at]
  end
end
