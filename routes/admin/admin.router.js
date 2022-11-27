const AdminBro = require('admin-bro');
const AdminBroExpress = require('admin-bro-expressjs');
const AdminBroMongoose = require('admin-bro-mongoose');
const bcrypt = require('bcryptjs');

const mongoose = require('mongoose');

AdminBro.registerAdapter(AdminBroMongoose);

const adminBro = new AdminBro({
    databases: [mongoose],
    resources: [{
        resource: require('../../models/Student'),
        options: {
            parent: {
                name: 'Users Database',
                // logo: '../../static/user.svg',
                icon: 'User',
            },
            properties: {
                password: {
                    isVisible: {
                        show: false, edit: true, filter: false, list: false
                    },
                },
                createdAt: {
                    isVisible: {
                        show: true, edit: false, filter: true, list: false
                    },
                },
                updatedAt: {
                    isVisible: {
                        show: true, edit: false, filter: true, list: false
                    },
                }
            },
        },
    },
    {
        resource: require('../../models/Classes'),
        options: {
            parent: {
                name: 'Classes Database',
                // logo: '../../static/class.png',
                icon: "Class"
            },
            properties: {
                createdAt: {
                    isVisible: {
                        show: true, edit: false, filter: true, list: false
                    },
                },
                updatedAt: {
                    isVisible: {
                        show: true, edit: false, filter: true, list: false
                    },
                }
            }
        },
    },
    {
        resource: require('../../models/Application'),
        options: {
            parent: {
                name: 'Application Database',
                // logo: '../../static/application.png',
                icon: "Application"
            },
            properties: {
                createdAt: {
                    isVisible: {
                        show: true, edit: false, filter: true, list: false
                    },
                },
                updatedAt: {
                    isVisible: {
                        show: true, edit: false, filter: true, list: false
                    },
                },
                reason: {
                    isVisible: {
                        show: true, edit: true, filter: false, list: false
                    },
                },
                senderId: {
                    isVisible: {
                        show: true, edit: false, filter: false, list: false
                    },
                },
                coordinatorId: {
                    isVisible: {
                        show: true, edit: false, filter: false, list: false
                    },
                },
                informerId: {
                    isVisible: {
                        show: true, edit: false, filter: false, list: false
                    },
                },
            }
        },
    }],
    rootPath: '/admin',
    branding: {
        logo: '../../static/logo.png',
        companyName: "Student Leave Management System"
    },

})

const ADMIN = {
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD
}

// const router = AdminBroExpress.buildRouter(adminBro);
const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    cookieName: process.env.ADMIN_COOKIE_NAME,
    cookiePassword: process.env.ADMIN_COOKIE_PASS,
    authenticate: async (username, password) => {
        if(username === ADMIN.username && password === ADMIN.password){
            return ADMIN;
        }
        return null;
    }
}); 

module.exports = router;