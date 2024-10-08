const { Ability, AbilityBuilder } = require('@casl/ability');

// policy
const policies = {
	guest(user, { can }) {
		can('read', 'Product');
		can('read', 'Category');
	},
	user(user, { can }) {
		can('read', 'Product');
		can('create', 'Product', { user_id: user._id });
		can('update', 'Product', { user_id: user._id });
		can('delete', 'Product', { user_id: user._id });
		can('read', 'Category');
		can('create', 'Category', { user_id: user._id });
		can('update', 'Category', { user_id: user._id });
		can('delete', 'Category', { user_id: user._id });
		can('view', 'Tag');
		can('create', 'Tag', { user_id: user._id });
		can('update', 'Tag', { user_id: user._id });
		can('delete', 'Tag', { user_id: user._id });
		can('view', 'Order');
		can('create', 'Order');
		can('read', 'Order', { user_id: user._id });
		can('update', 'User', { _id: user._id });
		can('read', 'Cart', { user_id: user._id });
		can('update', 'Cart', { user_id: user._id });
		can('view', 'DeliveryAddress');
		can('create', 'DeliveryAddress', { user_id: user._id });
		can('update', 'DeliveryAddress', { user_id: user._id });
		can('delete', 'DeliveryAddress', { user_id: user._id });
		can('read', 'Invoice', { user_id: user._id });
	},
	admin(user, { can }) {
		can('manage', 'all');
	},
};

const policyFor = (user) => {
	let builder = new AbilityBuilder();
	if (user && typeof policies[user.role] === 'function') {
		policies[user.role](user, builder);
	} else {
		policies['guest'](user, builder);
	}
	return new Ability(builder.rules);
};

module.exports = {
	policyFor,
};
