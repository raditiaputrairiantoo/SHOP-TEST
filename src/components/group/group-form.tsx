import Input from '@/components/ui/input';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useRouter } from 'next/router';
import { getIcon } from '@/utils/get-icon';
import Label from '@/components/ui/label';
import * as typeIcons from '@/components/icons/type';
import { AttachmentInput, Category, Type, TypeSettingsInput } from '@/types';
import { typeIconList } from './group-icons';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { typeValidationSchema } from './group-validation-schema';
import SelectInput from '@/components/ui/select-input';
import FileInput from '@/components/ui/file-input';
import Title from '@/components/ui/title';
import Alert from '@/components/ui/alert';
import TextArea from '@/components/ui/text-area';
import RadioCard from '@/components/ui/radio-card/radio-card';
import Checkbox from '@/components/ui/checkbox/checkbox';
import { useCreateTypeMutation, useUpdateTypeMutation } from '@/data/type';
import { EditIcon } from '@/components/icons/edit';
import { Config } from '@/config';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { join, split } from 'lodash';
import { formatSlug } from '@/utils/use-slug';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import ValidationError from '@/components/ui/form-validation-error';
import classNames from 'classnames';
import CategoryTypeFilter from '@/components/filters/category-type-filter';
import SwitchInput from '@/components/ui/switch-input';
import { useProductsQuery } from '@/data/product';

export const updatedIcons = typeIconList.map((item: any) => {
  item.label = (
    <div className="flex items-center space-s-5">
      <span className="flex h-5 w-5 items-center justify-center">
        {getIcon({
          iconList: typeIcons,
          iconName: item.value,
          className: 'max-h-full max-w-full',
        })}
      </span>
      <span>{item.label}</span>
    </div>
  );
  return item;
});

type FormValues = {
  name: string;
  slug?: string | null;
  icon?: any;
  promotional_sliders: AttachmentInput;
};

type IProps = {
  initialValues?: Type | null;
};
export default function CreateOrUpdateTypeForm({ initialValues }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [isSlugDisable, setIsSlugDisable] = useState<boolean>(true);
  const isSlugEditable =
    router?.query?.action === 'edit' &&
    router?.locale === Config.defaultLanguage;
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    shouldUnregister: true,
    // @ts-ignore
    resolver: yupResolver(typeValidationSchema),
    defaultValues: {
      ...initialValues,
      icon: initialValues?.icon
        ? typeIconList.find(
            (singleIcon) => singleIcon.value === initialValues?.icon,
          )
        : '',
    },
  });

  const { mutate: createType, isLoading: creating } = useCreateTypeMutation();
  const { mutate: updateType, isLoading: updating } = useUpdateTypeMutation();
  const slugAutoSuggest = formatSlug(watch('name'));
  const onSubmit = (values: FormValues) => {
    const input = {
      language: router.locale,
      name: values.name!,
      slug: values.slug!,
      icon: values.icon?.value,
      promotional_sliders: {
        thumbnail: values?.promotional_sliders?.thumbnail,
        original: values?.promotional_sliders?.original,
        id: values?.promotional_sliders?.id,
      },
    };

    if (
      !initialValues ||
      !initialValues.translated_languages?.includes(router.locale!)
    ) {
      console.log('create');
      createType({
        ...input,
        ...(initialValues?.slug && { slug: initialValues.slug }),
      });
    } else {
      console.log('update');
      updateType({
        ...input,
        id: initialValues.id!,
      });
    }
  };
  const { products, loading: loadingProduct } = useProductsQuery({
    limit: 999,
    language: router?.locale,
    type,
    categories: category,
    status: 'publish',
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:item-description')}
          details={`${
            initialValues
              ? t('form:item-description-update')
              : t('form:item-description-add')
          } ${t('form:type-description-help-text')}`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-name')}
            {...register('name')}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
            // disabled={[].includes(Config.defaultLanguage)}
          />
          {isSlugEditable ? (
            <div className="relative mb-5">
              <Input
                label={`${t('Slug')}`}
                {...register('slug')}
                error={t(errors.slug?.message!)}
                variant="outline"
                disabled={isSlugDisable}
              />
              <button
                className="absolute top-[27px] right-px z-10 flex h-[46px] w-11 items-center justify-center rounded-tr rounded-br border-l border-solid border-border-base bg-white px-2 text-body transition duration-200 hover:text-heading focus:outline-none"
                type="button"
                title={t('common:text-edit')}
                onClick={() => setIsSlugDisable(false)}
              >
                <EditIcon width={14} />
              </button>
            </div>
          ) : (
            <Input
              label={`${t('Slug')}`}
              {...register('slug')}
              value={slugAutoSuggest}
              variant="outline"
              className="mb-5"
              disabled
            />
          )}

          <div className="mb-5">
            <Label>{t('form:input-label-select-icon')}</Label>
            <SelectInput
              name="icon"
              control={control}
              options={updatedIcons}
              isClearable={true}
              placeholder="Select Icon"
            />
          </div>
        </Card>
      </div>

      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('form:promotional-image')}
          details={t('form:promotional-image-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <FileInput
            name="promotional_sliders"
            control={control}
            multiple={false}
          />
        </Card>
      </div>
      <StickyFooterPanel>
        <div className="mb-4 text-end">
          {initialValues && (
            <Button
              variant="outline"
              onClick={router.back}
              className="me-4"
              type="button"
            >
              {t('form:button-label-back')}
            </Button>
          )}

          <Button loading={creating || updating}>
            {initialValues
              ? t('form:button-label-update-group')
              : t('form:button-label-add-group')}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
}
