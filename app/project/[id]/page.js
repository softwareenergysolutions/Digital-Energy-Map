'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*, installers(*)')
        .eq('id', id)
        .single();

      if (!error) setProject(data);
      setLoading(false);
    };
    fetchProject();
  }, [id]);

  if (loading) return <div style={{ color: 'white', padding: '40px', background: '#07111f', minHeight: '100vh' }}>Cargando proyecto...</div>;
  if (!project) return <div style={{ color: 'white', padding: '40px', background: '#07111f', minHeight: '100vh' }}>Proyecto no encontrado.</div>;

  return (
    <div style={{ background: '#07111f', minHeight: '100vh', color: 'white', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        {project.photo_url && (
          <img src={project.photo_url} alt={project.title} style={{ width: '100%', borderRadius: '12px', marginBottom: '24px', maxHeight: '400px', objectFit: 'cover' }} />
        )}

        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>{project.title}</h1>
        <p style={{ color: '#94a3b8', marginBottom: '24px' }}>{project.neighborhood}, {project.city}, {project.state}</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
          {[
            ['Tamaño del sistema', `${project.system_size_kwp} kWp`],
            ['Número de paneles', project.panel_count],
            ['Batería incluida', project.battery_included ? 'Sí' : 'No'],
            ['Capacidad de batería', project.battery_capacity_kwh ? `${project.battery_capacity_kwh} kWh` : 'N/A'],
            ['Fecha de instalación', project.installation_date],
            ['Costo aproximado', project.approx_cost_mxn ? `$${project.approx_cost_mxn.toLocaleString()} MXN` : 'No especificado'],
          ].map(([label, value]) => (
            <div key={label} style={{ background: '#0f1f35', borderRadius: '10px', padding: '16px' }}>
              <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '4px' }}>{label}</p>
              <p style={{ fontWeight: '600', fontSize: '16px' }}>{value}</p>
            </div>
          ))}
        </div>

        {project.description && (
          <div style={{ background: '#0f1f35', borderRadius: '10px', padding: '20px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>Descripción</h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>{project.description}</p>
          </div>
        )}

        {project.installers && (
          <div style={{ background: '#0f1f35', borderRadius: '10px', padding: '20px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '12px' }}>Instalador</h2>
            <p style={{ fontWeight: '600' }}>{project.installers.company_name}</p>
            {project.installers.whatsapp && (
              <a
                href={`https://wa.me/${project.installers.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-block', marginTop: '12px', background: '#25d366', color: 'white', padding: '10px 20px', borderRadius: '30px', textDecoration: 'none', fontWeight: '500' }}
              >
                Contactar por WhatsApp
              </a>
            )}
          </div>
        )}
        <a href="/map" style={{ color: '#f0c040', textDecoration: 'none', fontSize: '14px' }}>← Volver al mapa</a>
      </div>
    </div>
  );
}