import AdminBro from 'admin-bro';
import AdminBroExpress from 'admin-bro-expressjs';
import AdminBroMongoose from 'admin-bro-mongoose';
import bcrypt from 'bcryptjs';
// const importExportFeature = require('@adminjs/import-export');
import importExportFeature from '@adminjs/import-export';
// console.log(importExportFeature.default())
import mongoose from 'mongoose';

import User from '../../models/Student.js';
import Classes from '../../models/Classes.js';
import Application from '../../models/Application.js';


AdminBro.registerAdapter(AdminBroMongoose);

const adminBro = new AdminBro({
    // databases: [mongoose],
    resources: [{
        resource: User,
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
            features: [importExportFeature.default()]
            // listProperties: ['fileUrl', 'mimeType'],
        },
    },
    {
        resource: Classes,
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
        resource: Application,
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
    logoutPath: '/admin/logout',
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

// module.exports = router;
export default router;