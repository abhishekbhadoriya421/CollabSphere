import User from './User';
import Channel from './Channel';
import ChannelMember from './ChannelMember';
import Activities from './Activities';
import sequelize from "../config/sqldb";


const models = {
    User,
    Channel,
    ChannelMember,
    Activities,
}


Object.values(models).forEach(model => {
    if ('associate' in model) {
        model.associate(models);
    }
});


export { sequelize };
export default models;