"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, TaskFormValues } from "@/schema/taskSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Calendar as CalendarIcon,
  UserPlus,
  X,
  Loader2,
  Flag,
  Activity,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useUserSearch } from "@/hooks/useUser";
import { User } from "@/lib/taskApi";

interface TaskFormProps {
  initialValues?: Partial<TaskFormValues> & { assignedUser?: string };
  taskMeta?: {
    createdById: string;
    assignedToId?: string;
  };
  currentUserId?: string;
  onSubmit: (data: TaskFormValues) => void;
  onDelete?: () => void;
  submitLabel?: string;
  deleteLabel?: string;
  isSubmitting?: boolean;
  isDeleting?: boolean;
}

export function TaskForm({
  initialValues,
  taskMeta,
  currentUserId,
  onSubmit,
  onDelete,
  submitLabel = "Save Changes",
  deleteLabel = "Delete Task",
  isSubmitting,
  isDeleting,
}: TaskFormProps) {
  const isCreator = taskMeta?.createdById === currentUserId;   // is current user creator
  const isAssignee = taskMeta?.assignedToId === currentUserId;   // is current user assingee
  const canEditDetails = isCreator;   // if creator? can edit all details
  const canEditStatus = isCreator || isAssignee;   // if assignee? can edit status and prio

  const [showUserList, setShowUserList] = useState(false);   // users list for assigning task
  const [selectedUser, setSelectedUser] = useState<User | null>(   // selected assignee
    initialValues?.assignedToId
      ? {
          id: initialValues.assignedToId,
          name: initialValues.assignedUser || "",
        }
      : null
  );
  const [searchQuery, setSearchQuery] = useState("");   // search state query
  const dropdownRef = useRef<HTMLDivElement>(null);   // for search user dropdown
  const { users, loading: usersLoading } = useUserSearch(searchQuery);   // loading state for users/assignee

  const form = useForm<TaskFormValues>({   // default form values as per cretion || editing
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialValues?.title || "",
      description: initialValues?.description || "",
      dueDate: initialValues?.dueDate || "",
      priority: initialValues?.priority || "MEDIUM",
      status: initialValues?.status || "PENDING",
      assignedToId: initialValues?.assignedToId || undefined,
    },
  });

  useEffect(() => {   // handles user search dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserList(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1.5">

        {/* Task Title */}
        <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Title{" "}
          {!isCreator && (
            <span className="lowercase tracking-normal italic text-slate-400/70">
              (Not Editable)
            </span>
          )}
        </Label>
        <Input
          {...form.register("title")}
          readOnly={!canEditDetails}
          className="h-10 border-slate-200 focus-visible:ring-indigo-500 disabled:bg-slate-50 readOnly:text-slate-500"
        />
        {form.formState.errors.title && (
          <p className="text-red-500 text-[11px] font-medium">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

        {/* Task Description */}
      <div className="space-y-1.5">
        <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Description{" "}
          {!isCreator && (
            <span className="lowercase tracking-normal italic text-slate-400/70">
              (Not Editable)
            </span>
          )}
        </Label>
        <Textarea
          {...form.register("description")}
          readOnly={!canEditDetails}
          className="min-h-[100px] border-slate-200 focus-visible:ring-indigo-500 resize-none disabled:bg-slate-50"
        />
      </div>

          {/* Task Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Due Date{" "}
            {!isCreator && (
              <span className="lowercase tracking-normal italic text-slate-400/70">
                (Not Editable)
              </span>
            )}
          </Label>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 z-10" />
            <DatePicker
              selected={
                form.watch("dueDate") ? new Date(form.watch("dueDate")) : null
              }
              onChange={(date: Date | null) => {
                if (date) {
                  form.setValue("dueDate", date.toISOString().split("T")[0]);
                } else {
                  form.setValue("dueDate", "");
                }
              }}
              readOnly={!canEditDetails}
              placeholderText="Set deadline"
              className="pl-9 h-10 border border-slate-200 w-full rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-50"
              dateFormat="yyyy-MM-dd"
              minDate={new Date(new Date().setHours(0, 0, 0, 0))}   // min date validation today at midnight
            />
          </div>
          {form.formState.errors.dueDate && (
            <p className="text-red-500 text-[11px] font-medium">
              {form.formState.errors.dueDate.message}
            </p>
          )}
        </div>

          {/* Task Priority */}
        <div className="space-y-1.5">
          <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Priority
          </Label>
          <Select
            value={form.watch("priority")}
            onValueChange={(val) => form.setValue("priority", val as any)}
            disabled={!canEditStatus}
          >
            <SelectTrigger className="h-10 border-slate-200 disabled:bg-slate-50">
              <div className="flex items-center gap-2">
                <Flag className="w-3.5 h-3.5 text-indigo-500" />
                <SelectValue placeholder="Select priority" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="URGENT">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

          {/* Task Status */}
      <div className="space-y-1.5">
        <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Status
        </Label>
        <Select
          value={form.watch("status")}
          onValueChange={(val) => form.setValue("status", val as any)}
          disabled={!canEditStatus}
        >
          <SelectTrigger className="h-10 border-slate-200 disabled:bg-slate-50">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-indigo-500" />
              <SelectValue placeholder="Select status" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

          {/* Task Asignee */}
      <div className="space-y-1.5 relative" ref={dropdownRef}>
        <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Assignee{" "}
          {!isCreator && (
            <span className="lowercase tracking-normal italic text-slate-400/70">
              (Not Editable)
            </span>
          )}
        </Label>
        <div className="relative">
          <UserPlus className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <Input
            placeholder={
              selectedUser ? selectedUser.name : "Search team members..."
            }
            value={searchQuery}
            onFocus={() => canEditDetails && setShowUserList(true)}
            onChange={(e) => {
              if (!canEditDetails) return;
              setSearchQuery(e.target.value);
              setShowUserList(true);
            }}
            readOnly={!canEditDetails}
            className="pl-9 h-10 border-slate-200 disabled:bg-slate-50"
          />
          {canEditDetails && (selectedUser || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedUser(null);
                form.setValue("assignedToId", undefined);
              }}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {showUserList && searchQuery.length >= 2 && (
          <div className="absolute bg-white border border-slate-200 mt-1 w-full max-h-48 overflow-y-auto z-50 shadow-xl rounded-xl animate-in fade-in slide-in-from-top-1">
            <div className="p-1">
              {usersLoading ? (
                <div className="p-3 flex items-center justify-center text-slate-400 text-xs italic">
                  <Loader2 className="w-3 h-3 animate-spin mr-2" /> Searching...
                </div>
              ) : users.length === 0 ? (
                <div className="p-3 text-slate-400 text-xs italic">
                  No users found
                </div>
              ) : (
                users.map((u) => (
                  <div
                    key={u.id}
                    className="p-2.5 hover:bg-slate-50 cursor-pointer rounded-lg flex items-center gap-3"
                    onClick={() => {
                      setSelectedUser(u);
                      form.setValue("assignedToId", u.id);
                      setSearchQuery("");
                      setShowUserList(false);
                    }}
                  >
                    <div className="w-7 h-7 bg-indigo-50 text-indigo-700 rounded-full flex items-center justify-center text-[10px] font-bold">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {u.name}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

        {/* Submit/Delete Task */}
      <div className="flex items-center gap-3 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white rounded-xl px-6 h-10 shadow-lg shadow-indigo-200"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              {submitLabel === "Create Task" ? "Creating..." : "Saving..."}
            </>
          ) : (
            submitLabel
          )}
        </Button>

        {onDelete && isCreator && (
          <Button
            type="button"
            variant="ghost"
            onClick={onDelete}
            className="text-red-500 hover:text-red-600 hover:bg-red-200 rounded-xl h-10 cursor-pointer bg-red-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Deleting...
              </>
            ) : (
              deleteLabel
            )}
          </Button>
        )}
      </div>
    </form>
  );
}
