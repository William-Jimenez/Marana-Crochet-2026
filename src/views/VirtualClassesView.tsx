import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  PlayCircle,
  CheckCircle2,
  Circle,
  Star,
  Users,
  Clock,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export const VirtualClassesView: React.FC = () => {
  const { virtualClasses, toggleLessonCompleted, enrollInClass } = useApp();
  const [selectedClassId, setSelectedClassId] = useState<string>(virtualClasses[0]?.id || '');

  const activeClass = virtualClasses.find((c) => c.id === selectedClassId) || virtualClasses[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
      {/* Header */}
      <div className="border-b border-stone-200 pb-5 mb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
          <GraduationCap className="w-4 h-4" />
          <span>Módulo de Formación Artesanal (HU-19 / HU-50)</span>
        </div>
        <h2 className="font-display text-2xl font-bold text-stone-900">
          Clases Virtuales & Masterclasses de Crochet
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Aprende desde la tensión básica hasta la técnica de amigurumis sin costuras de la mano de nuestras artesanas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Classes Catalog List (Left) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Talleres Disponibles
          </h3>

          {virtualClasses.map((cls) => {
            const isSelected = cls.id === activeClass?.id;
            const completedCount = cls.modules.filter((m) => m.completed).length;
            const progressPercent = Math.round((completedCount / cls.modules.length) * 100);

            return (
              <div
                key={cls.id}
                onClick={() => setSelectedClassId(cls.id)}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex gap-3 ${
                  isSelected
                    ? 'border-purple-800 bg-white shadow-md'
                    : 'border-stone-200 bg-stone-50/70 hover:bg-white'
                }`}
              >
                <img
                  src={cls.imageUrl}
                  alt={cls.title}
                  className="w-20 h-20 rounded-xl object-cover bg-stone-200 shrink-0 border border-stone-200"
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] text-purple-700 font-bold uppercase">
                      <span>{cls.level}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-stone-500">{cls.duration}</span>
                    </div>
                    <h4 className="text-xs font-bold text-stone-900 line-clamp-2 mt-0.5">
                      {cls.title}
                    </h4>
                  </div>

                  <div className="mt-2">
                    {cls.isEnrolled ? (
                      <div>
                        <div className="flex justify-between text-[10px] text-stone-500 mb-1">
                          <span>Progreso: {progressPercent}%</span>
                          <span>{completedCount}/{cls.modules.length} lecciones</span>
                        </div>
                        <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-700 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-[11px] font-semibold text-purple-900">
                        Inscripción Abierta
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Class Syllabus & Player (Right) */}
        {activeClass && (
          <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                <span className="font-semibold text-purple-800 uppercase tracking-wider">
                  Nivel {activeClass.level}
                </span>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span className="font-bold text-stone-800">{activeClass.rating.toFixed(1)}</span>
                  <span className="text-stone-400">({activeClass.studentsCount} tejedoras)</span>
                </div>
              </div>

              <h3 className="font-display text-xl font-bold text-stone-900">
                {activeClass.title}
              </h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                {activeClass.description}
              </p>
            </div>

            {/* Simulated Player View */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-stone-900 flex items-center justify-center text-white shadow-inner group">
              <img
                src={activeClass.imageUrl}
                alt="Clase de crochet"
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="relative z-10 text-center space-y-2 p-4">
                <div className="w-14 h-14 bg-purple-600/90 rounded-full flex items-center justify-center mx-auto shadow-lg hover:bg-purple-700 transition cursor-pointer">
                  <PlayCircle className="w-8 h-8 text-white fill-purple-900/40" />
                </div>
                <span className="text-xs font-semibold block drop-shadow-md">
                  Reproducir Módulo Actual
                </span>
              </div>
            </div>

            {/* Modules Syllabus Checklist */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-700" />
                  Temario de Lecciones ({activeClass.modules.length})
                </h4>
                <span className="text-[11px] text-stone-400">
                  Haz clic en el círculo para marcar completada
                </span>
              </div>

              <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden">
                {activeClass.modules.map((mod) => (
                  <div
                    key={mod.id}
                    onClick={() => toggleLessonCompleted(activeClass.id, mod.id)}
                    className="p-3.5 flex items-center justify-between hover:bg-purple-50/40 transition cursor-pointer text-xs"
                  >
                    <div className="flex items-center gap-3">
                      {mod.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-stone-300 shrink-0" />
                      )}
                      <span className={mod.completed ? 'line-through text-stone-400 font-medium' : 'text-stone-800 font-semibold'}>
                        {mod.title}
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-400 font-mono tabular-nums shrink-0">
                      {mod.duration}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Enroll button if not enrolled */}
            {!activeClass.isEnrolled && (
              <button
                onClick={() => enrollInClass(activeClass.id)}
                className="w-full py-3 bg-purple-900 hover:bg-purple-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>Inscribirme Gratis al Taller Virtual</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
