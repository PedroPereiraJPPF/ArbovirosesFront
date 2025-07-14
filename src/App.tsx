import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/Login';
import SignUp from './pages/Authentication/Register';
import DadosGerais from './pages/Dashboard/DadosGerais';
import CarregarDados from './pages/Dashboard/CarregarDados';
import PrevisaoDeCasos from './pages/Dashboard/PrevisaoDeCasos';
import DadosGeograficos from './pages/Dashboard/DadosGeograficos';
import DashboardBairro from './pages/Dashboard/DashboardBairro';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="Dashboard Arboviroses" />
              <DadosGerais />
            </>
          }
        />
        <Route
          path='/dashboard/dadosGerais'
          element={
            <>
              <PageTitle title="Dashboard Arboviroses" />
              <DadosGerais />
            </>
          }
        />
        <Route 
          path="/carregarDados"
          element={
            <>
              <PageTitle title="Carregar dados"/>
              <CarregarDados />
            </>
          }
        />
        <Route 
          path="/dashboard/previsaoCasos"
          element={
            <>
              <PageTitle title="Previsão de casos"/>
              <PrevisaoDeCasos />
            </>
          }
        />
        <Route 
          path="/dashboard/dadosGeograficos"
          element={
            <>
              <PageTitle title="Dados geográficos"/>
              <DadosGeograficos />
            </>
          }
        />
        <Route 
          path="/dashboard/bairro"
          element={
            <>
              <PageTitle title="Dados do Bairro"/>
              <DashboardBairro />
            </>
          }
        />
        <Route
          path="/auth/login"
          element={
            <>
              <PageTitle title="Login" />
              <SignIn />
            </>
          }
        />
        <Route
          path="/auth/registrar"
          element={
            <>
              <PageTitle title="Registrar" />
              <SignUp />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
