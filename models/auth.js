const models = {

  SelectUser: {
		name: 'add user',
		required_fields: [],
		text: 'select * from users u'
  },

	SelectByEmail: {
		name: 'select by email',
		required_fields: ['email'],
		text: 'SELECT users.* FROM users WHERE email = $1 LIMIT 8'
	},

	NewUser:{
		name: 'insert user',
		required_fields: ['email', 'firstname', 'lastname', 'password'],
		text:'inser into users (email, firstname, lastname, password) values ($1, $2, $3, $4)'
	},

	GetUidFromUser: {
		name:' get uid from user',
		required_fields:['user_id'],
		text:'select uu.* from users_uid uu where uu.user_id = $1'
	}
}

module.exports = models;
