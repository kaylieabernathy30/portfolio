"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, type ProjectFormData } from "@/lib/schemas";
import type { Project } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { addProjectAction, updateProjectAction } from "@/app/actions/projectActions";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface ProjectFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: Project | null;
  onSuccess: () => void; // Callback to refresh data or close dialog
}

export function ProjectFormDialog({ isOpen, onClose, projectToEdit, onSuccess }: ProjectFormDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: "", // Stored as comma-separated string in form
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (projectToEdit) {
      form.reset({
        title: projectToEdit.title,
        description: projectToEdit.description,
        tags: projectToEdit.tags.join(", "),
        imageUrl: projectToEdit.imageUrl || "",
      });
    } else {
      form.reset({
        title: "",
        description: "",
        tags: "",
        imageUrl: "",
      });
    }
  }, [projectToEdit, form, isOpen]); // Rerun effect if isOpen changes, to reset form if dialog reopens

  async function onSubmit(data: ProjectFormData) {
    setIsSubmitting(true);
    let result;
    if (projectToEdit) {
      result = await updateProjectAction(projectToEdit.id, data);
    } else {
      result = await addProjectAction(data);
    }
    setIsSubmitting(false);

    if (result.error) {
      toast({
        title: `Error ${projectToEdit ? 'updating' : 'adding'} project`,
        description: result.error + (result.issues ? ` Issues: ${JSON.stringify(result.issues)}` : ''),
        variant: "destructive",
      });
    } else {
      toast({
        title: `Project ${projectToEdit ? 'Updated' : 'Added'}`,
        description: result.success,
      });
      onSuccess(); // Call success callback (e.g., refresh data, close dialog)
      onClose();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-headline">{projectToEdit ? "Edit Project" : "Add New Project"}</DialogTitle>
          <DialogDescription>
            {projectToEdit ? "Update the details of your project." : "Fill in the details for your new project."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Project Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your project..." {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma-separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="React, Next.js, Firebase" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (projectToEdit ? "Save Changes" : "Add Project")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
