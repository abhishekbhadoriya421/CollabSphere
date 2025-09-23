/**
 * id           =>  is a unique channel name between to user
 * channel_type =>  its type of channel like group chat, personal dm message or broadcast message in eniter organization created by admin
 * channel_name =>  its depends on type of channel if its personal dm the user name if group the group name
 * created_by   =>  Who created the channel
 */
interface channels {
    id: number,
    channel_type: 'dm' | 'group' | 'channel',
    channel_name: string,
    created_by: string
}
interface initailStateResponse {
    loading: boolean | false
    message: string,
    status: 'error' | 'success' | 'idel',
    channels: Array<channels> | []
}


const initialState: initailStateResponse = {
    loading: false,
    message: '',
    status: 'idel',
    channels: []
}