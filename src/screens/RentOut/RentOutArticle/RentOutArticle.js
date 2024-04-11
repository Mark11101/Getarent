import { 
    View, 
    Text, 
    Alert,
    Animated,
    ScrollView,
    Dimensions,
    TouchableOpacity, 
} from 'react-native';
import React, { useState, useEffect } from 'react';
import RenderHtml, { defaultSystemFonts } from 'react-native-render-html';

import api from 'api';
import { WriteToSupportBtn, Waiter } from 'components';
import GoBackIcon from 'img/rent-out/go-back-article-icon.svg';
import GoBackBlackIcon from 'img/rent-out/go-back-article-icon-black.svg';

import s, { tagsStyles, classesStyles } from './styles';

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

const SCROLL_BOUND = HEIGHT / 2;

const systemFonts = [...defaultSystemFonts, 'DelaGothicOne-Regular', 'Inter-Regular'];

export const RentOutArticle = ({
	route: {
		params: { 
			article,
            articleId,
		},
	},
}) => {	

    const [content, setContent] = useState(article);
    const [isLoading, setIsLoading] = useState(false);
    const [webViewHeight, setWebViewHeight] = useState(0);

    const isWebViewSmall = webViewHeight < (HEIGHT + 100);

    const modalYOffset = new Animated.Value(0);

    const AnimetedBackBtn = Animated.createAnimatedComponent(TouchableOpacity);
    
    const scaleBannerAnimation = modalYOffset.interpolate({
        inputRange: [0, SCROLL_BOUND],
        outputRange: [1.1, 1],
    });

    const opacityHeaderAnimation = modalYOffset.interpolate({
        inputRange: [0, SCROLL_BOUND - 300],
        outputRange: [1, 0],
    });

    const opacityBlackBtnAnimation = modalYOffset.interpolate({
        inputRange: [0, SCROLL_BOUND - 100],
        outputRange: [0, 1],
    });
    
    useEffect(() => {

        if (articleId) {

            setIsLoading(true);
            
            api.web.getHostMyCarArticle(articleId).then((res) => {

                if (res?.error) {
                    Alert.alert(
                        'Упс',
                        'Кажется, статья еще не готова, попробуйте позже'
                    );
                    api.navigation.goBack();
                } else {
                    setContent(res?.data)
                }
            })
        }

    }, [articleId]);

    useEffect(() => {

        if (content && content.id) {
            setIsLoading(false);
        }

    }, [content]);

    const ArticleHeader = () => (

        <View style={[
            s.header
        ]}>
            <AnimetedBackBtn 
                style={[
                    s.goBackBtn,
                    !isWebViewSmall && { opacity: opacityHeaderAnimation }
                ]}
                onPress={() => api.navigation.goBack()}
            >
                <GoBackIcon />
            </AnimetedBackBtn>
            <AnimetedBackBtn 
                style={[
                    s.goBackBtn,
                    s.goBackBlackBtn,
                    !isWebViewSmall && { opacity: opacityBlackBtnAnimation }
                ]}
                onPress={() => api.navigation.goBack()}
            >
                <GoBackBlackIcon />
            </AnimetedBackBtn>
            <Animated.View style={[
                s.headerText,
                !isWebViewSmall && { opacity: opacityHeaderAnimation }
            ]}>
                <Text numberOfLines={2} style={s.title}>
                    {content.title}
                </Text>
            </Animated.View>
        </View>
    );
    
    return (
        <>
            {
                (isLoading  || !content)
                ?
                    <Waiter />
                :
                    <View style={s.content}>
                        {
                            !isWebViewSmall 
                            && 
                                <ArticleHeader />
                        }
                        {
                            content?.content
                            ?
                                <ScrollView
                                    bounces={false}
                                    scrollEventThrottle={16}
                                    contentContainerStyle={{ paddingBottom: 100 }}
                                    onScroll={(event) => modalYOffset.setValue(event.nativeEvent.contentOffset.y)}
                                >
                                    {
                                        isWebViewSmall 
                                        && 
                                            <ArticleHeader />
                                    }
                                    <View 
                                        style={[
                                            s.scroll,
                                        ]}
                                        onLayout={(e) => setWebViewHeight(e.nativeEvent.layout.height)}
                                    >
                                        <Text style={s.sectionName}>
                                            {content.pageSection.sectionName}
                                        </Text>
                                        <View style={s.divider} />
                                        <RenderHtml
                                            baseStyle={s.webView}
                                            contentWidth={WIDTH}
                                            tagsStyles={tagsStyles}
                                            classesStyles={classesStyles}
                                            systemFonts={systemFonts}
                                            source={{
                                                html: content.content
                                            }}
                                        />
                                        <View style={s.panel}>
                                            <Text style={s.supportTitle}>
                                                Не нашли ответ на ваш вопрос?
                                            </Text>
                                            <Text style={s.supportSubTitle}>
                                                Напишите в чат тех поддержки
                                            </Text>
                                            <WriteToSupportBtn text='Написать в поддержку' />
                                        </View>
                                    </View>
                                </ScrollView>
                            :
                                <Text style={s.noDataText}>
                                    Нет данных
                                </Text>
                        }
                    </View>
            }
        </>
    )
};
