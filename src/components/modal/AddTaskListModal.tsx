import Image from 'next/image';
import XIcon from '@/assets/icons/ic_x2.svg';
import React from 'react';
import ModalPortal from '../ModalPortal/ModalPortal';
import { useAddTaskListModalStore } from '@/store/useAddTaskListModalStore';
import { authAxiosInstance } from '@/app/api/auth/axiosInstance';
import { group } from 'console';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useAddTaskListToastStore } from '@/store/useToastStore';
import Toast from '../toast/Toast';

interface AddTeamModalProps {
  onClose: () => void;
  openToast: (message: string, type: 'success' | 'error') => void;
  groupId: number;
}

interface IFormData {
  name: string;
}
export default function AddTaskListModal({
  onClose,
  groupId,
  openToast,
}: AddTeamModalProps) {
  const { closeModal } = useAddTaskListModalStore();

  const postCreateTaskList = useMutation({
    mutationFn: (formData: IFormData) => {
      return authAxiosInstance.post(`/groups/${groupId}/task-lists`, formData);
    },
    onSuccess: async () => {
      console.log('할일 목록 생성 성공');
      const message = '할일 목록 생성 성공';
      openToast('할 일 목록 생성 성공!', 'success');

      closeModal();
      openToast(message, 'success');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    },
    onError: () => (error: any) => {
      console.error('에러 발생', error);
      openToast('할일 목록 생성 실패', 'error');
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IFormData>({
    mode: 'onChange',
  });

  const onSubmit = (data: IFormData) => {
    if (!data.name) {
      console.error('반드시 입력해야 함');
      return;
    }
    const formData = {
      name: data.name,
    };
    console.log(formData);
    postCreateTaskList.mutate(formData);
  };
  return (
    <div>
      <ModalPortal onClose={closeModal}>
        <div className="flex w-[384px] flex-col items-center rounded-t-[12px] bg-background-secondary px-4 pb-10 pt-4 md:rounded-b-[12px] lg:rounded-b-[12px]">
          <button className="ml-auto" onClick={onClose}>
            <Image width={24} height={24} src={XIcon} alt="엑스 버튼" />
          </button>
          <div className="flex w-[280px] flex-col">
            <p className="text-lg-medium text-center">할 일 목록</p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-6">
                <input
                  className={` ${!isValid ? 'border-status-danger ring-1 ring-status-danger' : 'border-brand-primary ring-1 ring-status-brand'}text-lg-regular mt-4 h-12 w-full rounded-[12px] border border-solid border-border-primary border-opacity-10 bg-background-secondary px-[14.5px] py-[16px] text-text-primary focus:border-status-brand focus:outline-none focus:ring-status-brand active:border-none`}
                  placeholder="목록 명을 입력해주세요."
                  {...register('name', {
                    required: true,
                  })}
                />
                {errors.name && (
                  <p className="text-md-medium mt-2 text-text-danger">
                    목록 명을 입력해주세요.
                  </p>
                )}
              </div>
              <button
                type="submit"
                className={`text-lg-semibold h-12 w-full rounded-[12px] ${
                  !isValid
                    ? 'cursor-not-allowed bg-gray-400'
                    : 'bg-brand-primary'
                }`}
                disabled={!isValid}
              >
                만들기
              </button>
            </form>
          </div>
        </div>
      </ModalPortal>
    </div>
  );
}
