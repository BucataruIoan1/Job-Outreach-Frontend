import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar';
import { Company } from './components/Company/Company';
import { PositionPage } from './components/Position/PositionPage';
import { EmailPage } from './components/Email/EmailPage';
import { ViewEmailPage } from './components/Email/ViewEmailPage';
import { CreateEmailPage } from './components/Email/CreateEmailPage';
import { UpdateEmailPage } from './components/Email/UpdateEmailPage';
import { SendEmailPage } from './components/SendEmail/SendEmailPage';
import { CountryPage } from './components/Country/CountryPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/companies" replace />} />
            <Route path="/companies" element={<Company />} />
            <Route path="/positions" element={<PositionPage />} />
            <Route path="/email" element={<EmailPage />} />
            <Route path="/email-view" element={<ViewEmailPage />} />
            <Route path="/email-create" element={<CreateEmailPage />} />
            <Route path="/email-edit/:id" element={<UpdateEmailPage />} />
            <Route path="/send" element={<SendEmailPage />} />
            <Route path="/countries" element={<CountryPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
