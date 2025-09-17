import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { type Pet } from '@/hooks/usePets';

const editPetSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  breed: z.string().min(1, 'Breed is required'),
  age: z.string().min(1, 'Age is required'),
  gender: z.enum(['Male', 'Female']),
  size: z.enum(['Small', 'Medium', 'Large']),
  color: z.string().min(1, 'Color is required'),
  description: z.string().min(1, 'Description is required'),
  health_status: z.string().min(1, 'Health status is required'),
  vaccination_status: z.string().min(1, 'Vaccination status is required'),
  spayed_neutered: z.boolean(),
  good_with_kids: z.boolean(),
  good_with_pets: z.boolean(),
  energy_level: z.enum(['Low', 'Medium', 'High']),
  location: z.string().min(1, 'Location is required'),
  adoption_fee: z.number().min(0, 'Adoption fee must be positive'),
});

type EditPetFormData = z.infer<typeof editPetSchema>;

interface EditPetDialogProps {
  pet: Pet;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Partial<Pet>) => Promise<void>;
}

export function EditPetDialog({ pet, open, onOpenChange, onSave }: EditPetDialogProps) {
  const [saving, setSaving] = useState(false);

  const form = useForm<EditPetFormData>({
    resolver: zodResolver(editPetSchema),
    defaultValues: {
      name: pet.name,
      breed: pet.breed || '',
      age: pet.age || '',
      gender: pet.gender as 'Male' | 'Female',
      size: pet.size as 'Small' | 'Medium' | 'Large',
      color: pet.color || '',
      description: pet.description || '',
      health_status: pet.health_status || '',
      vaccination_status: pet.vaccination_status || '',
      spayed_neutered: pet.spayed_neutered || false,
      good_with_kids: pet.good_with_kids || false,
      good_with_pets: pet.good_with_pets || false,
      energy_level: pet.energy_level as 'Low' | 'Medium' | 'High',
      location: pet.location || '',
      adoption_fee: pet.adoption_fee || 0,
    },
  });

  const onSubmit = async (data: EditPetFormData) => {
    setSaving(true);
    try {
      await onSave(data);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Pet Listing</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pet Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="breed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Breed</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., 2 years" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Small">Small</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="health_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Health Status</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Excellent" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vaccination_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vaccination Status</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Up to date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="energy_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Energy Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Mumbai, IN" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="adoption_fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adoption Fee (₹)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="spayed_neutered"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Spayed/Neutered</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="good_with_kids"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Good with Kids</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="good_with_pets"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Good with Pets</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}