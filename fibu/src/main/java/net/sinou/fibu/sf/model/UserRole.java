package net.sinou.fibu.sf.model;

/** Centralize known role definition */
public enum UserRole {

	ROLE_REGISTERED(Type.ROLE_REGISTERED), ROLE_MANAGER(Type.ROLE_MANAGER), ROLE_USER_ADMIN(Type.ROLE_USER_ADMIN), ROLE_ACCOUNTER(Type.ROLE_ACCOUNTER);

	/**
	 * Works around the fact that we cannot use Enum annotations.
	 * 
	 * <p>
	 * Example: <code> 
	 * &#64;Secured(UserRole.Type.ROLE_MANAGER) 
	 * Account save(Account account); 
	 * </code>
	 * </p>
	 */
	public class Type {
		public static final String ROLE_REGISTERED = "ROLE_REGISTERED";
		public static final String ROLE_MANAGER = "ROLE_MANAGER";
		public static final String ROLE_ACCOUNTER = "ROLE_ACCOUNTER";
		public static final String ROLE_USER_ADMIN = "ROLE_USER_ADMIN";
	}

	private final String label;

	private UserRole(String label) {
		this.label = label;
	}

	public String toString() {
		return this.label;
	}
}
