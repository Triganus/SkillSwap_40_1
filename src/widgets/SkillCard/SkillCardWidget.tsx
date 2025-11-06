import { useCallback, useState } from 'react';
import type { FC } from 'react';

import SkillCardUI from '@shared/ui/SkillCard/SkillCard';
import { ModalUI } from '@shared/ui/Modal/ModalUI';
import { Button } from '@shared/ui/Button';
import type { SkillCardProps } from '@shared/ui/SkillCard/type';
import type { TModalUIProps } from '@shared/ui/Modal/TModalUIProps';

type OfferPayload = {
  toUserId: string;
};

export type SkillCardWidgetProps = Omit<SkillCardProps, 'onDetailsClick'> & {
  // onOffer может вернуть промис или быть синхронной функцией
  onOffer?: (payload: OfferPayload) => Promise<void> | void;
  initialOpen?: boolean;
};

export const SkillCardWidget: FC<SkillCardWidgetProps> = ({
  user,
  teachingSkills = [],
  learningSkills = [],
  onToggleFavorite,
  isFavorite = false,
  className = '',
  onOffer,
  initialOpen = false,
}) => {
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(initialOpen);
  const [isOfferSent, setIsOfferSent] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);

  const handleOpenDetail = useCallback(() => setIsDetailOpen(true), []);
  const handleCloseDetail = useCallback(() => setIsDetailOpen(false), []);
  const handleOpenConfirmation = useCallback(() => setIsOfferSent(true), []);
  const handleCloseConfirmation = useCallback(() => setIsOfferSent(false), []);

  // простой заглушечный отправитель — не принимает параметр
  const defaultOffer = async (): Promise<void> => new Promise((res) => setTimeout(res, 1200));

  const sendOffer = useCallback(
    async (payload: OfferPayload) => {
      if (isSending) return;
      setIsSending(true);
      try {
        const fn = onOffer ?? defaultOffer;
        // fn can be sync or return a promise
        await Promise.resolve(fn(payload));
        handleOpenConfirmation();
      } catch (err) {
        // Временно логируем ошибку — позже заменить на уведомление пользователя

        console.error(err);
      } finally {
        setIsSending(false);
      }
    },
    [isSending, onOffer, handleOpenConfirmation]
  );

  const confirmActions: TModalUIProps['actions'] = [
    {
      label: 'Готово',
      onClick: () => {
        handleCloseConfirmation();
        handleCloseDetail();
      },
      variant: 'primary',
    },
  ];

  return (
    <>
      <SkillCardUI
        user={user}
        teachingSkills={teachingSkills}
        learningSkills={learningSkills}
        variant="compact"
        onToggleFavorite={onToggleFavorite}
        onDetailsClick={handleOpenDetail}
        isFavorite={isFavorite}
        className={className}
      />

      <ModalUI
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        title={teachingSkills[0]?.title ?? 'Навык'}
      >
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <div style={{ minWidth: 220 }}>
            <SkillCardUI
              user={user}
              teachingSkills={teachingSkills}
              learningSkills={learningSkills}
              variant="detailed"
              onToggleFavorite={onToggleFavorite}
              isFavorite={isFavorite}
            />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>{teachingSkills[0]?.title ?? 'Навык'}</h3>
              <p style={{ color: 'var(--color-secondary)', marginTop: 8 }}>
                {teachingSkills[0]?.description ?? 'Описание навыка отсутствует.'}
              </p>
            </div>

            <div style={{ marginTop: 18 }}>
              <Button
                variant="primary"
                size="medium"
                onClick={() => sendOffer({ toUserId: String(user?.id ?? '') })}
                disabled={isSending}
              >
                {isSending ? 'Отправка...' : 'Предложить обмен'}
              </Button>
            </div>

            <div style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {teachingSkills.slice(0, 3).map((s) => (
                  <span
                    key={s.id}
                    style={{ padding: '6px 10px', background: '#f3f6f0', borderRadius: 12 }}
                  >
                    {s.title}
                  </span>
                ))}
                {teachingSkills.length > 3 && (
                  <span style={{ padding: '6px 10px' }}>+{teachingSkills.length - 3}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </ModalUI>

      <ModalUI
        isOpen={isOfferSent}
        onClose={handleCloseConfirmation}
        actions={confirmActions}
        title=""
      >
        <div style={{ textAlign: 'center', padding: '8px 20px' }}>
          <div style={{ marginBottom: 12 }}>
            <svg
              width="56"
              height="56"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M12 2a5 5 0 0 0-5 5c0 2.69 2.15 4.95 5 5s5-2.26 5-5a5 5 0 0 0-5-5z" />
              <path d="M12 17a2 2 0 0 0 2-2c0-2-3-2-3-2" />
            </svg>
          </div>

          <h2 style={{ margin: '8px 0' }}>Ваше предложение создано</h2>
          <p style={{ color: 'var(--color-secondary)', marginBottom: 18 }}>
            Теперь вы можете предложить обмен
          </p>
        </div>
      </ModalUI>
    </>
  );
};

export default SkillCardWidget;
