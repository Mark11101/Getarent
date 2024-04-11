import { 
    View, 
    Text, 
    Image, 
    Animated,
    ScrollView,
    SafeAreaView, 
    TouchableOpacity, 
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';

import api from 'api';
import { HorizontalFilter, WriteToSupportBtn, TouchableScale, AccordionView } from 'components';

import BlackChatIcon from 'img/black-chat-icon.svg';
import GoBackIcon from 'img/rent-out/go-back-icon.svg';
import SearchIcon from 'img/rent-out/no-car/search.svg';

import s from './styles';

const SECTIONS = {
	BEGINNING: 'BEGINNING',
	EARN: 'EARN',
    INSURANCE: 'INSURANCE',
    RULES: 'RULES',
	HOST_RULES: 'HOST_RULES',
	GUEST_RULES: 'GUEST_RULES',
    LEGAL: 'LEGAL',
};

const getSectionValue = (id) => {

    switch (id) {
        case 1: return SECTIONS.BEGINNING
        case 5: return SECTIONS.EARN
        case 2: return SECTIONS.INSURANCE
        case 8: return SECTIONS.RULES
        case 4: return SECTIONS.LEGAL
    }
};
    
const tabs = [];

export const RentOutSection = ({
	route: {
		params: { 
            tabValue,
			articles,
            sections,
		},
	},
}) => {
    
    const [tab, setTab] = useState({
        id: 1,
        label: '',
        value: SECTIONS.BEGINNING,
    });

    useEffect(() => {

        tabs.length === 0 && sections.sort((a, b) => b.sortIndex - a.sortIndex).forEach((section) => tabs.push({
            id: section.id,
            label: section.sectionName,
            value: getSectionValue(section.id),
        }));

        setTab(tabs[0]);

    }, [sections]);

    useEffect(() => {
        !!tabValue && setTab(tabs.find((tab) => tab.value === tabValue) || tabs[0])
    }, [tabValue]);

    const beginningFadeAnim = useRef(new Animated.Value(0)).current;
    const earnFadeAnim = useRef(new Animated.Value(0)).current;
    const insuranceFadeAnim = useRef(new Animated.Value(0)).current;
    const rulesFadeAnim = useRef(new Animated.Value(0)).current;
    const hostRulesFadeAnim = useRef(new Animated.Value(0)).current;
    const guestRulesFadeAnim = useRef(new Animated.Value(0)).current;
    const legalFadeAnim = useRef(new Animated.Value(0)).current;

    const fadeIn = (animation) => {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    };

    const fadeOut = (animation) => {
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    };

    const [tabHeight, setTabHeight] = useState(0);
    const [tabsHeight, setTabsHeight] = useState({});

    useEffect(() => {
        
        if (tab.value === SECTIONS.BEGINNING) {
            fadeIn(beginningFadeAnim);
            setTabHeight(tabsHeight.beginning || 0);
        } else {
            fadeOut(beginningFadeAnim);
        };

        if (tab.value === SECTIONS.EARN) {
            fadeIn(earnFadeAnim);
            setTabHeight(tabsHeight.earn || 0);
        } else {
            fadeOut(earnFadeAnim);
        };

        if (tab.value === SECTIONS.INSURANCE) {
            fadeIn(insuranceFadeAnim);
            setTabHeight(tabsHeight.insurance || 0);
        } else {
            fadeOut(insuranceFadeAnim);
        };

        if (tab.value === SECTIONS.RULES) {
            fadeIn(rulesFadeAnim);
            setTabHeight(tabsHeight.hostRules || 0);
        } else {
            fadeOut(rulesFadeAnim);
        };

        if (tab.value === SECTIONS.HOST_RULES) {
            fadeIn(hostRulesFadeAnim);
            setTabHeight(tabsHeight.hostRules || 0);
        } else {
            fadeOut(hostRulesFadeAnim);
        };

        if (tab.value === SECTIONS.GUEST_RULES) {
            fadeIn(guestRulesFadeAnim);
            setTabHeight(tabsHeight.guestRules || 0);
        } else {
            fadeOut(guestRulesFadeAnim);
        };

        if (tab.value === SECTIONS.LEGAL) {
            fadeIn(legalFadeAnim);
            setTabHeight(tabsHeight.legal || 0);
        } else {
            fadeOut(legalFadeAnim);
        };

    }, [tab, tabsHeight]);

    const openLegalFileOrArticle = (title, id) => {
        
        switch (title) {
            case 'Агентский договор': 
                return api.navigation.navigate('DocumentPopup', { uri: 'https://storage.yandexcloud.net/getarent-documents-bucket/44c8b0961f3fa6b1.pdf' })
            case 'Договор аренды':
                return api.navigation.navigate('DocumentPopup', { uri: 'https://storage.yandexcloud.net/getarent-documents-bucket/4a3531f263936f16.pdf' })
            case 'Пользовательское соглашение': 
                return api.navigation.navigate('DocumentPopup', { uri: 'https://storage.yandexcloud.net/getarent-documents-bucket/3208ff5d2ed1a6a3.pdf' })
            case 'Порядок разрешения споров':
                return api.navigation.navigate('RentOutArticle', { articleId: id })
            case 'Согласие на обработку персональных данных':
                return api.navigation.navigate('DocumentPopup', { uri: 'https://storage.yandexcloud.net/getarent-documents-bucket/C_.pdf' })
            case 'Политика обработки персональных данных':
                return api.navigation.navigate('DocumentPopup', { uri: 'https://storage.yandexcloud.net/getarent-documents-bucket/c6364667735bbdaf.pdf' })
        }
    };

    const structureArticles = (articles) => {

        const sortedArticles = articles ? articles.sort((a, b) => b.sortIndex - a.sortIndex) : [];

        const articlesWithRubric = sortedArticles.filter((article) => article.pageRubric !== null && article);
        const articlesWithoutRubric = sortedArticles.filter((article) => article.pageRubric === null && article);

        const rubricMap = new Map();

        articlesWithRubric.forEach((article) => {

            const rubricID = article.pageRubric.id;
            
            if (rubricMap.has(rubricID)) {
                rubricMap.get(rubricID).push(article)
            } else {
                rubricMap.set(rubricID, [article]);
            }
        });
        
        return {
            withRubrics: [...rubricMap.values()],
            withoutRubrics: articlesWithoutRubric,
        };
    };
    
    const beginning  = structureArticles(articles.beginning);
    const earn       = structureArticles(articles.earn);
    const insurance  = structureArticles(articles.insurance);
    const rules      = structureArticles(articles.rules);
    const hostRules  = structureArticles(articles.hostRules);
    const guestRules = structureArticles(articles.guestRules);
    const legal      = structureArticles(articles.legal);

    return (
        <SafeAreaView style={s.safeAreaView}>
            <View style={s.header}>
                <TouchableOpacity 
                    style={s.goBackBtn}
                    onPress={() => api.navigation.goBack()}
                >
                    <GoBackIcon />
                </TouchableOpacity>
                <View style={s.headerRightBlock}>
                    <TouchableOpacity
                        style={s.search}
                        onPress={() => api.navigation.navigate('RentOutSearch')}
                    >
                        <SearchIcon />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={s.chatBtn}
                        onPress={() => api.navigation.navigate('Chats', { screen: 'Support' })}
                    >
                        <BlackChatIcon style={s.chatBtnIcon} />
                        <Text style={s.chatBtnText}>
                            Написать в чате
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView contentContainerStyle={
                { height: tabHeight + 200 }
            }>
                <Text style={s.headerText}>
                    Хостинг Getarent
                </Text>
                <HorizontalFilter
                    black
                    style={s.filter}
                    onPress={setTab}
                    activeFilter={tab}
                    contentContainerStyle={s.filterContent}
                    filters={tabs}
                />
                <View>
                    {
                        beginning.length !== 0
                        &&
                            <Animated.View 
                                style={[
                                    s.content,
                                    { opacity: beginningFadeAnim },
                                    tab.value === SECTIONS.BEGINNING && { zIndex: 1000 },
                                ]}
                            >
                                <Text style={s.subTitle}>
                                    {tab.label}
                                </Text>
                                <View 
                                    style={s.banners}
                                    onLayout={(e) => setTabsHeight({ ...tabsHeight, beginning: e.nativeEvent.layout.height })}
                                >
                                    {
                                        beginning.withRubrics.length !== 0
                                        &&
                                            <>
                                                {
                                                    beginning.withRubrics.map((articles) => (
                                                        <AccordionView
                                                            title={
                                                                <View style={[s.row, s.accordionListItem]}>
                                                                    {
                                                                        articles[0].pageRubric?.imageUrl
                                                                        &&
                                                                            <Image 
                                                                                source={articles[0].pageRubric?.imageUrl}
                                                                                style={s.accordionListItemIcon} 
                                                                            />
                                                                    }
                                                                    <Text style={s.articleListItemText}>
                                                                        {articles[0].pageRubric.rubricName}
                                                                    </Text>
                                                                </View>
                                                            }
                                                            titleStyle={[
                                                                s.articleslistTitle,
                                                                !articles[0].pageRubric?.imageUrl && { top: 4 }
                                                            ]}
                                                            style={s.accordionView}
                                                            expandedViewStyle={[ 
                                                                s.expandedViewStyle,
                                                                !articles[0].pageRubric?.imageUrl && { paddingLeft: 16 }
                                                            ]}
                                                        >
                                                            {
                                                                articles.map((article) => (
                                                                    <View key={article.id}>
                                                                        <TouchableScale 
                                                                            style={s.articleListItem} 
                                                                            onPress={() => api.navigation.navigate('RentOutArticle', { articleId: article.id })}
                                                                        >
                                                                            <Text style={s.articleListItemText}>
                                                                                {article.title}
                                                                            </Text>
                                                                        </TouchableScale>
                                                                    </View>
                                                                ))
                                                            }
                                                        </AccordionView>
                                                    ))
                                                }
                                            </>
                                    }
                                    {
                                        beginning.withoutRubrics.length !== 0
                                        && 
                                            <>
                                                {
                                                    beginning.withoutRubrics.map((article) => (
                                                        <View key={article.id}>
                                                            <TouchableScale 
                                                                style={s.articleListItem} 
                                                                onPress={() => api.navigation.navigate('RentOutArticle', { articleId: article.id })}
                                                            >
                                                                <Text style={s.articleListItemText}>
                                                                    {article.title}
                                                                </Text>
                                                            </TouchableScale>
                                                        </View>
                                                    ))
                                                }
                                            </>
                                    }
                                    <WriteToSupportBtn style={{ marginTop: 24 }} />
                                </View>
                            </Animated.View>
                    }
                    {
                        earn.length !== 0
                        &&
                            <Animated.View 
                                style={[
                                    s.content,
                                    { opacity: earnFadeAnim },
                                    tab.value === SECTIONS.EARN && { zIndex: 1000 },
                                ]}
                            >
                                <Text style={s.subTitle}>
                                    {tab.label}
                                </Text>
                                <View 
                                    style={s.banners}
                                    onLayout={(e) => setTabsHeight({ ...tabsHeight, earn: e.nativeEvent.layout.height })}
                                >
                                    {
                                        earn.withRubrics.length !== 0
                                        &&
                                            <>
                                                {
                                                    earn.withRubrics.map((articles) => (
                                                        <AccordionView
                                                            title={
                                                                <View style={[s.row, s.accordionListItem]}>
                                                                    {
                                                                        articles[0].pageRubric?.imageUrl
                                                                        &&
                                                                            <Image 
                                                                                source={{
                                                                                    uri: articles[0].pageRubric?.imageUrl
                                                                                }}
                                                                                style={s.accordionListItemIcon} 
                                                                            />
                                                                    }
                                                                    <Text style={s.articleListItemText}>
                                                                        {articles[0].pageRubric.rubricName}
                                                                    </Text>
                                                                </View>
                                                            }
                                                            titleStyle={[
                                                                s.articleslistTitle,
                                                                !articles[0].pageRubric?.imageUrl && { top: 4 }
                                                            ]}
                                                            style={s.accordionView}
                                                            expandedViewStyle={[ 
                                                                s.expandedViewStyle,
                                                                !articles[0].pageRubric?.imageUrl && { paddingLeft: 16 }
                                                            ]}
                                                        >
                                                            {
                                                                articles.map((article) => (
                                                                    <View key={article.id}>
                                                                        <TouchableScale 
                                                                            style={s.articleListItem} 
                                                                            onPress={() => api.navigation.navigate('RentOutArticle', { articleId: article.id })}
                                                                        >
                                                                            <Text style={s.articleListItemText}>
                                                                                {article.title}
                                                                            </Text>
                                                                        </TouchableScale>
                                                                    </View>
                                                                ))
                                                            }
                                                        </AccordionView>
                                                    ))
                                                }
                                            </>
                                    }
                                    {
                                        earn.withoutRubrics.length !== 0
                                        && 
                                            <>
                                                {
                                                    earn.withoutRubrics.map((article) => (
                                                        <View key={article.id}>
                                                            <TouchableScale 
                                                                style={s.articleListItem} 
                                                                onPress={() => api.navigation.navigate('RentOutArticle', { articleId: article.id })}
                                                            >
                                                                <Text style={s.articleListItemText}>
                                                                    {article.title}
                                                                </Text>
                                                            </TouchableScale>
                                                        </View>
                                                    ))
                                                }
                                            </>
                                    }
                                <WriteToSupportBtn style={{ marginTop: 24 }} />
                                </View>
                            </Animated.View>
                    }
                    {
                        insurance.length !== 0
                        &&
                            <Animated.View 
                                style={[
                                    s.content,
                                    { opacity: insuranceFadeAnim },
                                    tab.value === SECTIONS.INSURANCE && { zIndex: 1000 },
                                ]}
                            >
                                <Text style={s.subTitle}>
                                    {tab.label}
                                </Text>
                                <View 
                                    style={s.banners}
                                    onLayout={(e) => setTabsHeight({ ...tabsHeight, insurance: e.nativeEvent.layout.height })}
                                >
                                    {
                                        insurance.withRubrics.length !== 0
                                        &&
                                            <>
                                                {
                                                    insurance.withRubrics.map((articles) => (
                                                        <AccordionView
                                                            title={
                                                                <View style={[s.row, s.accordionListItem]}>
                                                                    {
                                                                        articles[0].pageRubric?.imageUrl
                                                                        &&
                                                                            <Image 
                                                                                source={{
                                                                                    uri: articles[0].pageRubric?.imageUrl
                                                                                }}
                                                                                style={s.accordionListItemIcon} 
                                                                            />
                                                                    }
                                                                    <Text style={s.articleListItemText}>
                                                                        {articles[0].pageRubric.rubricName}
                                                                    </Text>
                                                                </View>
                                                            }
                                                            titleStyle={[
                                                                s.articleslistTitle,
                                                                !articles[0].pageRubric?.imageUrl && { top: 4 }
                                                            ]}
                                                            style={s.accordionView}
                                                            expandedViewStyle={[ 
                                                                s.expandedViewStyle,
                                                                !articles[0].pageRubric?.imageUrl && { paddingLeft: 16 }
                                                            ]}
                                                        >
                                                            {
                                                                articles.map((article) => (
                                                                    <View key={article.id}>
                                                                        <TouchableScale 
                                                                            style={s.articleListItem} 
                                                                            onPress={() => api.navigation.navigate('RentOutArticle', { articleId: article.id })}
                                                                        >
                                                                            <Text style={s.articleListItemText}>
                                                                                {article.title}
                                                                            </Text>
                                                                        </TouchableScale>
                                                                    </View>
                                                                ))
                                                            }
                                                        </AccordionView>
                                                    ))
                                                }
                                            </>
                                    }
                                    {
                                        insurance.withoutRubrics.length !== 0
                                        && 
                                            <>
                                                {
                                                    insurance.withoutRubrics.map((article) => (
                                                        <View key={article.id}>
                                                            <TouchableScale 
                                                                style={s.articleListItem} 
                                                                onPress={() => api.navigation.navigate('RentOutArticle', { articleId: article.id })}
                                                            >
                                                                <Text style={s.articleListItemText}>
                                                                    {article.title}
                                                                </Text>
                                                            </TouchableScale>
                                                        </View>
                                                    ))
                                                }
                                            </>
                                    }
                                    <WriteToSupportBtn style={{ marginTop: 24 }} />
                                </View>
                            </Animated.View>
                    }
                    {
                        rules.length !== 0
                        &&
                            <Animated.View 
                                style={[
                                    s.content,
                                    { opacity: rulesFadeAnim },
                                    tab.value === SECTIONS.RULES && { zIndex: 1000 },
                                ]}
                            >
                                <Text style={s.subTitle}>
                                    {tab.label}
                                </Text>
                                <View 
                                    style={s.banners}
                                    onLayout={(e) => setTabsHeight({ ...tabsHeight, rules: e.nativeEvent.layout.height })}
                                >
                                    {
                                        rules.withRubrics.length !== 0
                                        &&
                                            <>
                                                {
                                                    rules.withRubrics.map((articles) => (
                                                        <AccordionView
                                                            title={
                                                                <View style={[s.row, s.accordionListItem]}>
                                                                    {
                                                                        articles[0].pageRubric?.imageUrl
                                                                        &&
                                                                            <Image 
                                                                                source={{
                                                                                    uri: articles[0].pageRubric?.imageUrl
                                                                                }}
                                                                                style={s.accordionListItemIcon} 
                                                                            />
                                                                    }
                                                                    <Text style={s.articleListItemText}>
                                                                        {articles[0].pageRubric.rubricName}
                                                                    </Text>
                                                                </View>
                                                            }
                                                            titleStyle={[
                                                                s.articleslistTitle,
                                                                !articles[0].pageRubric?.imageUrl && { top: 4 }
                                                            ]}
                                                            style={s.accordionView}
                                                            expandedViewStyle={[ 
                                                                s.expandedViewStyle,
                                                                !articles[0].pageRubric?.imageUrl && { paddingLeft: 16 }
                                                            ]}
                                                        >
                                                            {
                                                                articles.map((article) => (
                                                                    <View key={article.id}>
                                                                        <TouchableScale 
                                                                            style={s.articleListItem} 
                                                                            onPress={() => api.navigation.navigate('RentOutArticle', { articleId: article.id })}
                                                                        >
                                                                            <Text style={s.articleListItemText}>
                                                                                {article.title}
                                                                            </Text>
                                                                        </TouchableScale>
                                                                    </View>
                                                                ))
                                                            }
                                                        </AccordionView>
                                                    ))
                                                }
                                            </>
                                    }
                                    {
                                        rules.withoutRubrics.length !== 0
                                        && 
                                            <>
                                                {
                                                    rules.withoutRubrics.map((article) => (
                                                        <View key={article.id}>
                                                            <TouchableScale 
                                                                style={s.articleListItem} 
                                                                onPress={() => api.navigation.navigate('RentOutArticle', { articleId: article.id })}
                                                            >
                                                                <Text style={s.articleListItemText}>
                                                                    {article.title}
                                                                </Text>
                                                            </TouchableScale>
                                                        </View>
                                                    ))
                                                }
                                            </>
                                    }
                                    <WriteToSupportBtn style={{ marginTop: 24 }} />
                                </View>
                            </Animated.View>
                    }
                    {
                        hostRules.length !== 0
                        &&
                            <Animated.View 
                                style={[
                                    s.content,
                                    { opacity: hostRulesFadeAnim },
                                    tab.value === SECTIONS.HOST_RULES && { zIndex: 1000 },
                                ]}
                            >
                                <Text style={s.subTitle}>
                                    {tab.label}
                                </Text>
                                <View 
                                    style={{ paddingHorizontal: 16 }}
                                    onLayout={(e) => setTabsHeight({ ...tabsHeight, hostRules: e.nativeEvent.layout.height })}
                                >
                                    {
                                        hostRules.withRubrics.length !== 0
                                        &&
                                            <>
                                                {
                                                    hostRules.withRubrics.map((articles) => (
                                                        <AccordionView
                                                            title={
                                                                <View style={[s.row, s.accordionListItem]}>
                                                                    {
                                                                        articles[0].pageRubric?.imageUrl
                                                                        &&
                                                                            <Image 
                                                                                source={{
                                                                                    uri: articles[0].pageRubric?.imageUrl
                                                                                }}
                                                                                style={s.accordionListItemIcon} 
                                                                            />
                                                                    }
                                                                    <Text style={s.articleListItemText}>
                                                                        {articles[0].pageRubric.rubricName}
                                                                    </Text>
                                                                </View>
                                                            }
                                                            titleStyle={[
                                                                s.articleslistTitle,
                                                                !articles[0].pageRubric?.imageUrl && { top: 4 }
                                                            ]}
                                                            style={s.accordionView}
                                                            expandedViewStyle={[ 
                                                                s.expandedViewStyle,
                                                                !articles[0].pageRubric?.imageUrl && { paddingLeft: 16 }
                                                            ]}
                                                        >
                                                            {
                                                                articles.map((article) => (
                                                                    <View key={article.id}>
                                                                        <TouchableScale 
                                                                            style={s.articleListItem} 
                                                                            onPress={() => api.navigation.navigate('RentOutArticle', { articleId: article.id })}
                                                                        >
                                                                            <Text style={s.articleListItemText}>
                                                                                {article.title}
                                                                            </Text>
                                                                        </TouchableScale>
                                                                    </View>
                                                                ))
                                                            }
                                                        </AccordionView>
                                                    ))
                                                }
                                            </>
                                    }
                                    {
                                        hostRules.withoutRubrics.length !== 0
                                        && 
                                            <>
                                                {
                                                    hostRules.withoutRubrics.map((article) => (
                                                        <View key={article.id}>
                                                            <TouchableScale 
                                                                style={s.articleListItem} 
                                                                onPress={() => api.navigation.navigate('RentOutArticle', { articleId: article.id })}
                                                            >
                                                                <Text style={s.articleListItemText}>
                                                                    {article.title}
                                                                </Text>
                                                            </TouchableScale>
                                                        </View>
                                                    ))
                                                }
                                            </>
                                    }
                                <WriteToSupportBtn style={{ marginTop: 24 }} />
                                </View>
                            </Animated.View>
                    }
                    {
                        guestRules.length !== 0
                        &&
                            <Animated.View 
                                style={[
                                    s.content,
                                    { opacity: guestRulesFadeAnim },
                                    tab.value === SECTIONS.GUEST_RULES && { zIndex: 1000 },
                                ]}
                            >
                                <Text style={s.subTitle}>
                                    {tab.label}
                                </Text>
                                <View 
                                    style={{ paddingHorizontal: 16 }}
                                    onLayout={(e) => setTabsHeight({ ...tabsHeight, guestRules: e.nativeEvent.layout.height })}
                                >
                                    {
                                        guestRules.withRubrics.length !== 0
                                        &&
                                            <>
                                                {
                                                    guestRules.withRubrics.map((articles) => (
                                                        <AccordionView
                                                            title={
                                                                <View style={[s.row, s.accordionListItem]}>
                                                                    {
                                                                        articles[0].pageRubric?.imageUrl
                                                                        &&
                                                                            <Image 
                                                                                source={{
                                                                                    uri: articles[0].pageRubric?.imageUrl
                                                                                }}
                                                                                style={s.accordionListItemIcon} 
                                                                            />
                                                                    }
                                                                    <Text style={s.articleListItemText}>
                                                                        {articles[0].pageRubric.rubricName}
                                                                    </Text>
                                                                </View>
                                                            }
                                                            titleStyle={[
                                                                s.articleslistTitle,
                                                                !articles[0].pageRubric?.imageUrl && { top: 4 }
                                                            ]}
                                                            style={s.accordionView}
                                                            expandedViewStyle={[ 
                                                                s.expandedViewStyle,
                                                                !articles[0].pageRubric?.imageUrl && { paddingLeft: 16 }
                                                            ]}
                                                        >
                                                            {
                                                                articles.map((article) => (
                                                                    <View key={article.id}>
                                                                        <TouchableScale 
                                                                            style={s.articleListItem} 
                                                                            onPress={() => api.navigation.navigate('RentOutArticle', { articleId: article.id })}
                                                                        >
                                                                            <Text style={s.articleListItemText}>
                                                                                {article.title}
                                                                            </Text>
                                                                        </TouchableScale>
                                                                    </View>
                                                                ))
                                                            }
                                                        </AccordionView>
                                                    ))
                                                }
                                            </>
                                    }
                                    {
                                        guestRules.withoutRubrics.length !== 0
                                        && 
                                            <>
                                                {
                                                    guestRules.withoutRubrics.map((article) => (
                                                        <View key={article.id}>
                                                            <TouchableScale 
                                                                style={s.articleListItem} 
                                                                onPress={() => api.navigation.navigate('RentOutArticle', { articleId: article.id })}
                                                            >
                                                                <Text style={s.articleListItemText}>
                                                                    {article.title}
                                                                </Text>
                                                            </TouchableScale>
                                                        </View>
                                                    ))
                                                }
                                            </>
                                    }
                                <WriteToSupportBtn style={{ marginTop: 24 }} />
                                </View>
                            </Animated.View>
                    }
                    {
                        legal.length !== 0
                        &&
                            <Animated.View 
                                style={[
                                    s.content,
                                    { opacity: legalFadeAnim },
                                    tab.value === SECTIONS.LEGAL && { zIndex: 1000 },
                                ]}
                            >
                                <Text style={s.subTitle}>
                                    {tab.label}
                                </Text>
                                <View 
                                    style={{ paddingHorizontal: 16 }}
                                    onLayout={(e) => setTabsHeight({ ...tabsHeight, legal: e.nativeEvent.layout.height })}
                                >
                                    {
                                        legal.withRubrics.length !== 0
                                        &&
                                            <>
                                                {
                                                    legal.withRubrics.map((articles) => (
                                                        <AccordionView
                                                            title={
                                                                <View style={[s.row, s.accordionListItem]}>
                                                                    {
                                                                        articles[0].pageRubric?.imageUrl
                                                                        &&
                                                                            <Image 
                                                                                source={{
                                                                                    uri: articles[0].pageRubric?.imageUrl
                                                                                }}
                                                                                style={s.accordionListItemIcon} 
                                                                            />
                                                                    }
                                                                    <Text style={s.articleListItemText}>
                                                                        {articles[0].pageRubric.rubricName}
                                                                    </Text>
                                                                </View>
                                                            }
                                                            titleStyle={[
                                                                s.articleslistTitle,
                                                                !articles[0].pageRubric?.imageUrl && { top: 4 }
                                                            ]}
                                                            style={s.accordionView}
                                                            expandedViewStyle={[ 
                                                                s.expandedViewStyle,
                                                                !articles[0].pageRubric?.imageUrl && { paddingLeft: 16 }
                                                            ]}
                                                        >
                                                            {
                                                                articles.map((article) => (
                                                                    <View key={article.id}>
                                                                        <TouchableScale 
                                                                            style={s.articleListItem} 
                                                                            onPress={() => api.navigation.navigate('RentOutArticle', { articleId: article.id })}
                                                                        >
                                                                            <Text style={s.articleListItemText}>
                                                                                {article.title}
                                                                            </Text>
                                                                        </TouchableScale>
                                                                    </View>
                                                                ))
                                                            }
                                                        </AccordionView>
                                                    ))
                                                }
                                            </>
                                    }
                                    {
                                        legal.withoutRubrics.length !== 0
                                        && 
                                            <>
                                                {
                                                    legal.withoutRubrics.map((article) => (
                                                        <View key={article.id}>
                                                            <TouchableScale 
                                                                style={s.articleListItem} 
                                                                onPress={() => openLegalFileOrArticle(article.title, article.id)}
                                                            >
                                                                <Text style={s.articleListItemText}>
                                                                    {article.title}
                                                                </Text>
                                                            </TouchableScale>
                                                        </View>
                                                    ))
                                                }
                                            </>
                                    }
                                <WriteToSupportBtn style={{ marginTop: 24 }} />
                                </View>
                            </Animated.View>
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    )
};
