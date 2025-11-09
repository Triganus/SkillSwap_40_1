import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Skill } from '@entities/skill/model/types/types';
import type { DbUser } from '@entities/user/model';

/**
 * Хук для работы с предложениями обмена навыками
 */
export function useSkillExchange(
  skill: Skill | undefined,
  authorRaw: DbUser | undefined,
  currentUser: { id: string } | null,
  isAuthenticated: boolean
) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sentExchanges, setSentExchanges] = useState<Array<{ toUserId: string; skillId: string }>>(
    []
  );

  useEffect(() => {
    if (currentUser) {
      const exchangesKey = `exchanges_${currentUser.id}`;
      const exchanges = JSON.parse(localStorage.getItem(exchangesKey) || '[]');
      setSentExchanges(exchanges);
    }
  }, [currentUser]);

  const isAlreadyProposed = useMemo(() => {
    if (!currentUser || !authorRaw || !skill) return false;
    return sentExchanges.some(
      (exchange) => exchange.toUserId === authorRaw.id && exchange.skillId === skill.id
    );
  }, [currentUser, authorRaw, skill, sentExchanges]);

  const onExchangeClick = useCallback(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: false, state: { from: location } });
      return;
    }

    if (!currentUser || !authorRaw || !skill) return;

    const exchangesKey = `exchanges_${currentUser.id}`;
    const exchanges = JSON.parse(localStorage.getItem(exchangesKey) || '[]');
    const newExchange = {
      fromUserId: currentUser.id,
      toUserId: authorRaw.id,
      skillId: skill.id,
      timestamp: new Date().toISOString(),
    };
    exchanges.push(newExchange);
    localStorage.setItem(exchangesKey, JSON.stringify(exchanges));

    setSentExchanges((prev) => [...prev, { toUserId: authorRaw.id, skillId: skill.id }]);
    setIsModalOpen(true);
  }, [isAuthenticated, currentUser, authorRaw, skill, navigate, location]);

  return { isAlreadyProposed, isModalOpen, setIsModalOpen, onExchangeClick };
}
