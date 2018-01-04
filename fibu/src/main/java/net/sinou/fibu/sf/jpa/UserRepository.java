package net.sinou.fibu.sf.jpa;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.annotation.Secured;

import net.sinou.fibu.sf.model.User;
import net.sinou.fibu.sf.model.UserRole;

@Secured(UserRole.Type.ROLE_USER_ADMIN)
@RepositoryRestResource(exported = false)
public interface UserRepository extends CrudRepository<User, Long> {

	@Override
	<S extends net.sinou.fibu.sf.model.User> S save(S entity);

	@Override
	void delete(Long id);

	// User save(User user);

	User findByUsername(String username);

}