'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { fetchAddress, saveAddress } from '@/src/store/slices/userSlice';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const addressSchema = z.object({
  street: z
    .string()
    .min(3, 'Street is required')
    .transform((s) => s.trim()),
  city: z
    .string()
    .min(2, 'City is required')
    .regex(/^[a-zA-Z\s]+$/, 'City must contain only letters')
    .transform((s) => s.trim()),
  state: z
    .string()
    .min(2, 'State is required')
    .regex(/^[a-zA-Z\s]+$/, 'State must contain only letters')
    .transform((s) => s.trim()),
  zip_code: z
    .string()
    .min(4, 'zip_code must be at least 4 digits')
    .max(6, 'zip_code must be at most 6 digits')
    .regex(/^\d+$/, 'zip_code must contain only numbers'),
});

type AddressFormData = z.infer<typeof addressSchema>;

const AddressPage = () => {
  const dispatch = useAppDispatch();
  const { address, loading } = useAppSelector((state) => state.user);

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    dispatch(fetchAddress());
  }, [dispatch]);

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });

  useEffect(() => {
    if (address) {
      form.reset({
        street: address.street,
        city: address.city,
        state: address.state,
        zip_code: address.zip_code,
      });
    }
  }, [address, form]);

  if (loading || !address) {
    return (
      <div className="flex justify-center items-center min-h-75">
        <p className="text-gray-500 text-lg">No Address Found</p>
      </div>
    );
  }

  const onSubmit = async (data: AddressFormData) => {
    await dispatch(saveAddress(data));
    await dispatch(fetchAddress());
    setEditMode(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-700">My Address</h2>

      <div className="rounded-2xl p-5 shadow-sm bg-white ring-1 ring-gray-200">
        {!editMode ? (
          <div className="flex justify-between items-center">
            <div>
              <p>{address.street}</p>
              <p>
                {address.city}, {address.state}
              </p>
              <p>{address.zip_code}</p>

              <span className="text-gray-500 text-sm font-medium">
                Default
              </span>
            </div>

            <Button
              className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 cursor-pointer"
              onClick={() => setEditMode(true)}
            >
              Edit
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 h-40 mt-5"
            >
              <div className="grid sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="w-full px-3 py-2 rounded-lg ring-1 ring-gray-200"
                          {...field}
                          placeholder="Street"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="w-full px-3 py-2 rounded-lg ring-1 ring-gray-200"
                          {...field}
                          placeholder="City"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="w-full px-3 py-2 rounded-lg ring-1 ring-gray-200"
                          {...field}
                          placeholder="State"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zip_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="w-full px-3 py-2 rounded-lg ring-1 ring-gray-200"
                          {...field}
                          placeholder="zip_code"
                          inputMode="numeric"
                          maxLength={6}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                  type="submit"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  type="button"
                  className="px-4 py-2 rounded-lg ring-1 ring-gray-200 hover:bg-gray-100"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};

export default AddressPage;