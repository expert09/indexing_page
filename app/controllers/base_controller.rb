class BaseController < ApplicationController
  #before_filter :parse_request

  private
  	def parse_request
  	  req = request.body.read
  	  @json = JSON.parse(req) if req && req.length > 2
  	end
end