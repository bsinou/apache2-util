package net.sinou.fibu.sf.jpa;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import net.sinou.fibu.sf.model.Account;

@RepositoryRestResource(collectionResourceRel = "accounts", path = "accounts")
public interface AccountRepository extends PagingAndSortingRepository<Account, Integer> {

	List<Account> findByCode(@Param("code") String code);

	@Override
	@PreAuthorize("hasRole('ROLE_MANAGER')") // UserRole.Type.ROLE_MANAGER
	<S extends Account> S save(S entity);

	@Override
	@PreAuthorize("hasRole('ROLE_MANAGER')")
	// @Secured({UserRole.Type.ROLE_MANAGER, UserRole.Type.ROLE_ACCOUNTER})
	void delete(Account entity);

}
