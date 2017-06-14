package com.searchink.tms.exception;

import org.springframework.boot.context.embedded.ConfigurableEmbeddedServletContainer;
import org.springframework.boot.context.embedded.EmbeddedServletContainerCustomizer;
import org.springframework.boot.web.servlet.ErrorPage;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;

@Configuration
class ErrorConfiguration implements EmbeddedServletContainerCustomizer {

   @Override public void customize( ConfigurableEmbeddedServletContainer container ) {
       container.addErrorPages( new ErrorPage( HttpStatus.NOT_FOUND, "/errors/404" ) );
   }

}
