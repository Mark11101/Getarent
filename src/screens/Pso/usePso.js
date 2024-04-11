import {useCallback, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import api from 'api';
import actions from 'actions';
import {useFocusEffect} from '@react-navigation/native';
import {getPsoConfig} from './config';

export const useCachedPRIStorageKey = () => {
    const {
        rent = {},
    } = useSelector(st => st.rentRoom, shallowEqual);

    return `RentalInspection[rentId=${rent.id}]`;
}

export default function usePso({role, uuid, stepName, isStart, nextStep, insured}) {
    const dispatch = useDispatch()
    const {photos: uploadedPhotos, deletedIds} = useSelector(({pso}) => pso)

    const steps = getPsoConfig(role, insured);
    const cachedStorageKey = useCachedPRIStorageKey();

    const [finish, setFinish] = useState(false);
    const [waiter, setWaiter] = useState(false);

    const goBack = useCallback(() => {
        const currentStep = steps[stepName];
        api.navigation.navigate(currentStep.prev, {uuid, isStart, role, insured});
    }, [steps, stepName, uuid, isStart, role]);

    const onSubmit = useCallback(async () => {
        setWaiter(true);

        const photosToSubmit = uploadedPhotos
            .filter(p => p.respInfo && p.respInfo.isUpload)
            .map(p => ({
                key: p.respInfo.key,
                sequentialIdWithinStep: p.sequentialIdWithinStep,
            }));
        try {
            const res = await api.web.updatePsoEndpoint(
                role,
                uuid,
                stepName,
                photosToSubmit,
                deletedIds,
                isStart
            );

            if (res?.error) {
                console.log(res.error);
                throw res.error;
            }
            await nextStep(uuid, isStart, role);
        } catch (err) {
            dispatch(actions.error('Попробуйте еще раз'));
        } finally {
            setWaiter(false);
        }
    }, [
        isStart,
        role,
        uuid,
        stepName,
        uploadedPhotos,
        deletedIds,
        nextStep,
        dispatch,
    ]);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            setWaiter(true);

            const getData = async () => {
                try {
                    const inspection =
                        role === 'GUEST' ? 'guestInspection' : 'hostInspection';
                    const otherInspection =
                        role === 'GUEST' ? 'hostInspection' : 'guestInspection';
                    const {
                        [inspection]: {step},
                        [otherInspection]: {finished},
                    } = await api.web.getPsoEndpoint(
                        role,
                        uuid,
                        stepName,
                        isStart
                    );

                    if (isActive) {
                        dispatch(actions.psoSetInitialPhotos(step.photos));
                        setFinish(finished);
                    }

                    if (!step.photos.length) {
                        try {
                            const imagesByStep = await api.storage.getWithoutErrorHandling(cachedStorageKey);
                            const cachedImages = imagesByStep[stepName];

                            for (const cachedImage of cachedImages) {
                                dispatch(actions.psoAddPhoto(cachedImage));
                            }
                        } catch (e) {
                            // nothing
                        }
                    }

                } catch (err) {
                    console.log(err);
                    dispatch(
                        actions.error(
                            'Не удалось загрузить данные, попробуйте еще раз'
                        )
                    );
                } finally {
                    setWaiter(false);
                }
            };

            getData();

            return () => {
                isActive = false;
                dispatch(actions.psoResetState());
            };
        }, [isStart, role, stepName, uuid, dispatch])
    );

    return {
        waiter,
        finish,
        goBack,
        onSubmit,
        setWaiter,
    };
}
