package net.sinou.fibu.sf;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;

//@SpringBootApplication
//@Configuration
@EnableAutoConfiguration
@ComponentScan
//@EnableWebMvc
// @ComponentScan(basePackages = "net.sinou.fibu.sf.services,
// net.sinou.fibu.sf.jpa, net.sinou.fibu.sf.model")
public class FibuMicroservice {
	// private final Logger log = LoggerFactory.getLogger(FibuMicroservice.class);

	public static void main(String[] args) {
		SpringApplication.run(FibuMicroservice.class, args);
	}
}