import { Feather,MaterialIcons,FontAwesome5 } from '@expo/vector-icons';

export const icon = {
    index: (props) => <Feather name='home' size={22} {...props}/>,
    history: (props) => <MaterialIcons name='history' size={22} {...props}/>,
    profile: (props) => <FontAwesome5 name='user-alt' size={22} {...props}/>
}