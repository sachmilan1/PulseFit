import { View,Text, TouchableOpacity,ImageBackground} from "react-native";
import { router } from "expo-router";
import style  from '../AppStyles.js'

export default function option(){
    return(
        <View style={style.container}>
            <TouchableOpacity
            onPress={async()=>{
                router.replace({
                    pathname:'upperLower/filter/[constraint]',
                    params:{
                        constraint:'upper',
                    }
                })
            }}
            style={style.button}
            >
                <Text style={style.buttonText}>Upper</Text>
            </TouchableOpacity>

            <TouchableOpacity
            onPress={async()=>{
                router.replace({
                    pathname:'/upperLower/filter/[constraint]',
                    params:{
                        constraint:'lower',
                    }
                })
            }}
            style={style.button}>
                <Text style={style.buttonText}>Lower</Text>
            </TouchableOpacity>
        </View>
    )
}