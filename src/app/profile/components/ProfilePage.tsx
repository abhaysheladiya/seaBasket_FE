"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { fetchUser, updateUser, User } from "@/src/store/slices/userSlice";
import { Input } from "@/components/ui/input";
import Loading from "@/src/ui/Loading";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.user);

  const [editMode, setEditMode] = useState(false);

  const form = useForm<User>({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: 0,
    },
  });

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      form.reset(user);
    }
  }, [user, form]);

  const onSubmit = (data: User) => {
    dispatch(
      updateUser({
        first_name: data.first_name,
        last_name: data.last_name,
        phone: Number(data.phone),
      }),
    );
    setEditMode(false);
  };

  if (loading || !user) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-gray-200 h-100">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">My Details</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-between items-center border-b pb-3">
              <FormLabel className="text-gray-500">Name</FormLabel>

              {editMode ? (
                <div className="flex gap-3">
                  <FormField
                    control={form.control}
                    name="first_name"
                    rules={{ required: "First name is required" }}
                    render={({ field }) => (
                      <FormItem className="w-60">
                        <FormControl>
                          <Input
                            className="border rounded-lg px-3 py-2 w-60 focus:outline-none focus:ring-2 focus:ring-gray-300"
                            placeholder="First name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    rules={{ required: "Last name is required" }}
                    render={({ field }) => (
                      <FormItem className="w-60">
                        <FormControl>
                          <Input
                            className="border rounded-lg px-3 py-2 w-60 focus:outline-none focus:ring-2 focus:ring-gray-300"
                            placeholder="Last name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ) : (
                <span className="font-medium">
                  {user.first_name} {user.last_name}
                </span>
              )}
            </div>

            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500">Email</span>
              <span className="font-medium">{user.email}</span>
            </div>

            <div className="flex justify-between items-center border-b pb-3">
              <FormLabel className="text-gray-500">Phone</FormLabel>

              {editMode ? (
                <FormField
                  control={form.control}
                  name="phone"
                  rules={{
                    required: "Phone is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Enter valid 10-digit number",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem className="w-60">
                      <FormControl>
                        <Input
                          className="border rounded-lg px-3 py-2 w-60 focus:outline-none focus:ring-2 focus:ring-gray-300"
                          {...field}
                          inputMode="numeric"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <span className="font-medium">{user.phone}</span>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              {editMode ? (
                <>
                  <Button type="submit" className="bg-gray-700 text-white px-5 py-2 rounded-lg">
                    Save
                  </Button>

                  <Button
                    type="button"
                    onClick={() => {
                      form.reset(user);
                      setEditMode(false);
                    }}
                    className="ring-1 px-5 py-2 rounded-lg"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setEditMode(true);
                  }}
                  className="bg-gray-700 text-white px-5 py-2 rounded-lg cursor-pointer"
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProfilePage;