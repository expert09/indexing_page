class PagesController < BaseController
  def index
  	pages = Page.all
  	render json: pages
  end

  def create
  	page = Page.new(page_params)
  	if uri?(page.url) && page.save
  	  render json: page
  	else
  	  head :no_content
  	end
  end

  def show
  	page = Page.find(params[:id]);
  	if !page.parsed?
  	  require 'open-uri'
  	  require 'open_uri_redirections'
  	  doc = Nokogiri::HTML(open(page.url, :allow_redirections => :all))
  	  params[:tags].each do |tagName|
  	  	tags = doc.xpath('//' + tagName);
		tags.each do |tag|
		  content = Content.new
		  content.page_id = page.id
		  content.tagname = tagName
		  content.content = tag
		  content.save
  	  	end
  	  end
  	  
  	  page.parsed = true;
  	  page.save
  	end
  	
  	render json: page.contents
  end

  private
  	def page_params
  	  params.require(:page).permit(:url)
  	end

  	def uri?(string)
	  uri = URI.parse(string)
	  %w( http https ).include?(uri.scheme)
	rescue URI::BadURIError
	  false
	rescue URI::InvalidURIError
	  false
	end
end
