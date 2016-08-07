class AddParsedToPages < ActiveRecord::Migration
  def change
    add_column :pages, :parsed, :boolean
  end
end
