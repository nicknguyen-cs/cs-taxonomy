const contentstack = require("contentstack");
const contentstackManagement = require('@contentstack/management');

const Stack = contentstack.Stack({
    api_key: process.env.REACT_APP_API_KEY,
    delivery_token: process.env.REACT_APP_DELIVERY_TOKEN,
    environment: process.env.REACT_APP_ENVIRONMENT,
    region: process.env.REACT_APP_REGION ? process.env.REACT_APP_REGION : "us",
});

const client = contentstackManagement.client()
client.login({ email: process.env.EMAIL, password: process.env.PASSWORD })
    .then(() => console.log('Logged in successfully'))

if (process.env.CUSTOM_HOST) {
    Stack.setHost(process.env.CUSTOM_HOST);
}


export default {
    getEntry(contentTypeUid) {
        return new Promise((resolve, reject) => {
            const query = Stack.ContentType(contentTypeUid).Query();
            query
                .includeOwner()
                .toJSON()
                .find()
                .then(
                    (result) => {
                        resolve(result);
                    },
                    (error) => {
                        reject(error);
                    },
                );
        });
    },

    async getMultipleEntries(contentTypeUids, tag) {
        return new Promise((resolve, reject) => {
            let data = [];
            const promises = [];
            for (let i = 0; i < contentTypeUids.length; i++) {
                promises.push(new Promise((resolve, reject) => {
                    const query = Stack.ContentType(contentTypeUids[i].value).Query();
                    if (tag.length > 0) {
                        let where = [];
                        for (let j = 0; j < tag.length; j++) {
                            where.push({ "brand.taxonomy": tag[j].value });
                        }
                        query.or(...where);
                    }
                    query
                        .includeOwner()
                        .toJSON()
                        .find()
                        .then(
                            (result) => {
                                for (let j = 0; j < result[0].length; j++) {
                                    result[0][j].content_type = contentTypeUids[i].value; // used on the href to link
                                    data.push(result[0][j]);
                                }
                                resolve();
                            },
                            (error) => {
                                reject(error);
                            }
                        )
                }))
            }
            return Promise.all(promises)
                .then(() => { resolve(data) })
                .catch((error) => { reject(error) })
        });
    },

    getContentTypes() {
        return new Promise((resolve, reject) => {
            const query = Stack.getContentTypes();
            query
                .then(
                    (result) => {
                        resolve(result.content_types);
                    },
                    (error) => {
                        reject(error);
                    },
                );
        });
    },

    getGlobalField(contentTypeUid) {
        return new Promise((resolve, reject) => {
            client.stack({ "api_key": process.env.REACT_APP_API_KEY, management_token: process.env.REACT_APP_MANAGEMENT_TOKEN }).globalField(contentTypeUid).fetch()
                .then((result) => {
                    resolve(result);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

}
