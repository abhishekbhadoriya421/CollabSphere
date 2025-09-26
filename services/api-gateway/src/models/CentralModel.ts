import User from './User';
import Channel from './Channel';
import ChannelMember from './ChannelMember';
import Memberships from './Memberships';
import Organization from './Organization';
import Activities from './Activities';
import sequelize from "../config/sqldb";


const models = {
    User,
    Channel,
    ChannelMember,
    Activities,
    Memberships,
    Organization
}


Object.values(models).forEach(model => {
    if ('associate' in model) {
        model.associate(models);
    }
});


export { sequelize };
export default models;