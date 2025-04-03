#
#  Jekyll Preview Tag - Generate link previews inside you articles.
#  This plugin uses nokogiri and ruby-readability to create a preview and create a local cached snippet.
#  By: Aleks Maksimow, Kaffeezucht.de
#
#  Required Gems/Libraries: nokogiri, open-uri, ruby-readability, digest
#
#  Usage:
#
#  1. Generate a new folder called "_cache" in your Jekyll directory.
#     This will hold all linked snippets, so you don't need to regenerate them on every regeneration of your site.
#
#  2. Use the following link syntax:
#
#     {% preview http://example.com/some-article.html %}
#
#  3. In case we can't fetch the Title from a linksource, you can set it manually:
#
#     {% preview "Some Article" http://example.com/some-article.html %}
#
#  Feel free to send a pull-request: https://github.com/aleks/jekyll_preview_tag
#

require 'rubygems'
require 'nokogiri'
require 'open-uri'
require 'readability'
require 'digest'

module Jekyll
  class PreviewTag < Liquid::Tag

    @tag_text, @link_url, @link_title = nil

    def initialize(tag_name, tag_text, tokens)
      super
      @tag_text = tag_text
    end

    def build_preview_content
      if cache_exists?(@link_url)
        @preview_content = read_cache(@link_url)
      else
        source = Nokogiri::HTML(URI.open(@link_url))

        #Refactor these to get specific og tags and failback if not found

        @preview_text = get_content(source)
        if @link_title == ''
          @preview_title = get_content_title(source)
        else
          @preview_title = @link_title
        end

        @preview_img_url = get_og_image_url(source)

        @preview_content = "<h4><a href='#{@link_url}' target='_blank'>#{@preview_title.to_s}</a></h4><img width='64' src='#{@preview_img_url}' /><small>#{@preview_text.to_s}</small>"

        write_cache(@link_url, @preview_content)
      end
    end

    def render(context)
      unless @tag_text.nil?
        rendered_text = Liquid::Template.parse(@tag_text).render(context)
        p "#{rendered_text}"
        @link_url = rendered_text.scan(/https?:\/\/[\S]+/).first.to_s
        p @link_url
        @link_title = rendered_text.scan(/\"(.*)\"/)[0].to_s.gsub(/\"|\[|\]/,'')
        p @link_title

        build_preview_content
      end
      %|#{@preview_content}|
    end

    def get_content(source)
      cleanup(Readability::Document.new(source, :tags => %w[]).content)
    end

    def get_content_title(source)
      if source.css('.entry-title').first
        cleanup(source.css('.entry-title').first.content)
      elsif source.css('.title').first
        cleanup(source.css('.title').first.content)
      elsif source.css('.article_title').first
        cleanup(source.css('.article_title').first.content)
      elsif source.css('h1').first
        cleanup(source.css('h1').first.content)
      elsif source.css('h2').first
        cleanup(source.css('h2').first.content)
      elsif source.css('h3').first
        cleanup(source.css('h3').first.content)
      end
    end

    def get_og_image_url(source)
      if source.css('meta[property="og:image"]').first
        return source.css('meta[property="og:image"]').first["content"]
      end
      return ""
    end

    def cleanup(content)
      content = content.gsub(/\t/,'')
      if content.size < 200
        content
      else
        content[0..200] + '...'
      end
    end

    def cache_key(link_url)
      Digest::MD5.hexdigest(link_url.to_s)
    end

    def cache_exists?(link_url)
      File.exist?("_cache/#{cache_key(link_url)}")
    end

    def write_cache(link_url, content)
      File.open("_cache/#{cache_key(link_url)}", 'w') { |f| f.write(content) }
    end

    def read_cache(link_url)
      File.read("_cache/#{cache_key(link_url)}")
    end
  end
end

Liquid::Template.register_tag('preview', Jekyll::PreviewTag)
