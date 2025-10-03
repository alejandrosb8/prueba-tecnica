import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { TaskDto } from '../../models';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-task-list',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly tasksApi = inject(TaskService);
  private readonly auth = inject(AuthService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly tasks = signal<TaskDto[]>([]);
  readonly editingId = signal<number | null>(null);

  readonly editing = computed(() => this.editingId() !== null);

  readonly form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: [''],
  });

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.loading.set(true);
    this.error.set(null);
    this.tasksApi.getTasks().subscribe({
      next: (data) => {
        this.tasks.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'No se pudieron cargar las tareas');
        this.loading.set(false);
      },
    });
  }

  save() {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    this.loading.set(true);
    const id = this.editingId();
    const req$ =
      id === null ? this.tasksApi.createTask(value) : this.tasksApi.updateTask(id, value);
    req$.subscribe({
      next: () => {
        this.form.reset();
        this.editingId.set(null);
        this.refresh();
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Error al guardar');
        this.loading.set(false);
      },
    });
  }

  edit(t: TaskDto) {
    this.form.setValue({ title: t.title, description: t.description ?? '' });
    this.editingId.set(t.id);
  }

  remove(t: TaskDto) {
    if (!confirm('¿Eliminar tarea?')) return;
    this.loading.set(true);
    this.tasksApi.deleteTask(t.id).subscribe({
      next: () => this.refresh(),
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Error al eliminar');
        this.loading.set(false);
      },
    });
  }

  logout() {
    this.auth.logout();
  }
}
