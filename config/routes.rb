IndexPage::Application.routes.draw do
  resources :contents
  resources :pages

  scope '/api' do
    scope '/v1' do
      scope '/pages' do
        get '/' => 'pages#index'
        post '/' => 'pages#create'
        scope '/:id' do
          get '/' => 'pages#show'
          delete '/' => 'pages#delete'
        end
      end
    end
  end
end
