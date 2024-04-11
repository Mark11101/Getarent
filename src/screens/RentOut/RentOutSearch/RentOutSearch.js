import React from 'react';
import { SafeAreaView, ScrollView, View, TouchableOpacity, Text, TextInput } from 'react-native';

import api from 'api';
import ClearIcon from 'img/auth/cross.svg';
import GoBackIcon from 'img/rent-out/go-back-icon.svg';
import AcceptSystemIcon from 'img/rent-out/no-car/accept-system-icon.svg';

import s from './styles';

export const RentOutSearch = () => {

    const [input, setInput] = React.useState('');
    const [result, setResult] = React.useState([]);

    React.useEffect(() => {
        !!input && api.web.getHostMyCarSearch(input).then((res) => !res?.error && setResult(res?.data));
    }, [input]);

    const lightUpText = (text, input) => {
        
        if (text.toLowerCase().includes(input.toLowerCase()) || input.toLowerCase().includes(text.toLowerCase())) {
            
            return (
                <>
                    <Text style={[s.articleBackground]}>
                        {text.substring(0, input.length)}
                    </Text>
                    {text.slice(input.length)}
                </>
            )
        } else {
            return (
                <>
                    {text}
                </>
            )
        }
    };
    
    return (
        <SafeAreaView style={s.safeAreaView}>
            <View style={s.header}>
                <TouchableOpacity 
                    style={s.goBackBtn}
                    onPress={() => api.navigation.goBack()}
                >
                    <GoBackIcon />
                </TouchableOpacity>
                <Text style={s.headerText}>
                    Найти в хостинге
                </Text>
            </View>
            <View style={s.content}>
                <View style={s.inputView}>
                    <TextInput 
                        autoFocus
                        value={input}
                        style={s.input}
                        onChangeText={setInput}
                    />
                    {
                        !!input
                        &&
                            <TouchableOpacity onPress={() => {
                                setInput('');
                                setResult([]);
                            }}>
                                <ClearIcon />
                            </TouchableOpacity>
                    }
                </View>
                <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
                    {
                        input && result && result.map((article, index) => (
                            <View key={article.id}>
                                <TouchableOpacity 
                                    style={s.article}
                                    onPress={() => api.navigation.navigate('RentOutArticle', { articleId: article.id })}
                                >
                                    <AcceptSystemIcon  
                                        style={{ marginRight: 16 }}
                                    />
                                    <View style={{flexShrink: 1}}>
                                        <View style={s.row}>
                                            {
                                                article.pageUserType
                                                &&
                                                    <Text style={s.sectionText}>
                                                        {article.pageUserType === 'Хост' && 'Владельцы  '}
                                                        {article.pageUserType === 'Гост' && 'Водители  '}
                                                    </Text>
                                            }
                                            {
                                                article.pageSection?.sectionName
                                                &&
                                                    <Text style={s.sectionText}>
                                                        {article.pageSection.sectionName}
                                                    </Text>
                                            }
                                        </View>
                                        {
                                            article.title
                                            &&
                                                <Text style={s.articleTitle}>
                                                    {lightUpText(article.title, input)}
                                                </Text>
                                        }
                                        {
                                            article.pageRubric?.rubricName
                                            &&
                                                <Text numberOfLines={2} style={s.articleText}>
                                                    {article.pageRubric.rubricName}
                                                </Text>
                                        }
                                    </View>
                                </TouchableOpacity>
                                {
                                    index !== result.length - 1
                                    &&
                                        <View style={s.divider} />
                                }
                            </View>
                        ))
                    }
                </ScrollView>
                {
                    input.length !== 0 && result?.length === 0
                    &&
                        <Text style={s.noDataText}>
                            Ничего не найдено
                        </Text>
                }
            </View>
        </SafeAreaView>
    )
};
