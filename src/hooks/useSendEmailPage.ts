import { useState, useEffect, useCallback } from "react";
import { Company } from "../types/Company";
import { Country } from "../types/Country";
import { Email } from "../types/Email";
import { Position } from "../types/Position";
import { FilterState } from "../types/FilterState";
import { companyService, CompanyQueryParams } from "../services/companyService";
import { countryService } from "../services/countryService";
import { positionService } from "../services/positionService";
import { emailService } from "../services/emailService";
import { TableFilterInput, FilterType } from "../components/Common/Table/TableFilterInput";

type NotificationType = "success" | "error";

interface NotificationState {
  message: string;
  type: NotificationType;
}

export const useSendEmailPage = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<number[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Email | null>(null);
  
  const [loadingData, setLoadingData] = useState(true);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [sendingEmails, setSendingEmails] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [companyFilterMode, setCompanyFilterMode] = useState<"uncontacted" | "all">("uncontacted");
  const [filters, setFilters] = useState<FilterState>({
    companyName: "",
    companyPhone: "",
    companyPhoneFilterType: "contains",
    companyEmail: "",
    companyEmailFilterType: "contains",
    companyUrl: "",
    positions: "",
  });

  const [notification, setNotification] = useState<NotificationState | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const fetchCompanies = useCallback(async (page: number, size: number) => {
    try {
      setLoadingCompanies(true);
      const params: CompanyQueryParams = {
        page,
        pageSize: size,
        sortColumn: sortColumn || undefined,
        sortOrder: sortOrder || undefined,
        ...filters,
      };
      const method = companyFilterMode === "uncontacted" 
        ? companyService.getUncontacted 
        : companyService.getAll;
        
      const data = await method(params);
      setCompanies(data.items);
      setTotalItems(data.totalCount);
      setCurrentPage(page);
      setPageSize(size);
    } catch (err) {
      console.error("Failed to fetch companies", err);
      setNotification({
        message: "A apărut o eroare la încărcarea companiilor.",
        type: "error",
      });
    } finally {
      setLoadingCompanies(false);
    }
  }, [sortColumn, sortOrder, filters, companyFilterMode]);

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        const [companiesData, countriesData] = await Promise.all([
          companyService.getUncontacted({
            page: 1,
            pageSize: pageSize,
          }),
          countryService.getAll(),
        ]);
        setCompanies(companiesData.items);
        setTotalItems(companiesData.totalCount);
        setCountries(countriesData);
      } catch (err) {
        console.error("Failed to load send email data", err);
        setError("A apărut o eroare la încărcarea companiilor sau țărilor.");
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []); // Run once on mount

  // Debounced filter effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCompanies(1, pageSize);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters, fetchCompanies, pageSize]);

  // Sort effect
  useEffect(() => {
    fetchCompanies(currentPage, pageSize);
  }, [sortColumn, sortOrder, fetchCompanies, currentPage, pageSize]);

  // Mode change effect
  useEffect(() => {
    setCurrentPage(1);
    setSelectedCompanyIds([]);
  }, [companyFilterMode]);

  // Notification timer
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 3000);
    return () => clearTimeout(timer);
  }, [notification]);

  // Load positions when country changes
  useEffect(() => {
    if (selectedCountry) {
      positionService
        .getByCountryId(selectedCountry.id)
        .then((data) => {
          setPositions(data);
          setSelectedPosition(null);
        })
        .catch(console.error);
    } else {
      setPositions([]);
      setSelectedPosition(null);
    }
  }, [selectedCountry]);

  // Load template when country/position changes
  useEffect(() => {
    const fetchTemplate = async () => {
      if (!selectedCountry || !selectedPosition) {
        setSelectedTemplate(null);
        return;
      }

      try {
        setLoadingTemplate(true);
        const template = await emailService.getByCountryId(
          selectedCountry.id,
          selectedPosition.id,
        );
        if (!template) {
          setSelectedTemplate(null);
          setNotification({
            message:
              "Nu există template configurat pentru această țară și poziție.",
            type: "error",
          });
          return;
        }
        setSelectedTemplate(template);
      } catch (err) {
        console.error("Failed to load email template", err);
        setNotification({
          message: "Eroare la încărcarea template-ului.",
          type: "error",
        });
      } finally {
        setLoadingTemplate(false);
      }
    };

    fetchTemplate();
  }, [selectedCountry, selectedPosition]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const handleFilterChange = (
    key: keyof FilterState,
    value: string | FilterType,
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handlePageChange = (page: number) => {
    fetchCompanies(page, pageSize);
  };

  const handlePageSizeChange = (size: number) => {
    fetchCompanies(1, size);
  };

  const handleToggleCompany = (companyId: number) => {
    setSelectedCompanyIds((prev) =>
      prev.includes(companyId)
        ? prev.filter((id) => id !== companyId)
        : [...prev, companyId],
    );
  };

  const handleToggleAllCompanies = () => {
    if (paginatedCompanies.length === 0) return;

    if (allCompaniesSelected) {
      setSelectedCompanyIds((prev) =>
        prev.filter((id) => !paginatedCompanies.find((c) => c.id === id)),
      );
    } else {
      const newIds = paginatedCompanies.map((c) => c.id);
      setSelectedCompanyIds((prev) => {
        const unique = new Set([...prev, ...newIds]);
        return Array.from(unique);
      });
    }
  };

  const paginatedCompanies = companies;
  const selectedCompaniesCount = selectedCompanyIds.length;
  const allCompaniesSelected =
    paginatedCompanies.length > 0 &&
    paginatedCompanies.every((c) => selectedCompanyIds.includes(c.id));

  const handleSendEmails = async () => {
    if (selectedCompanyIds.length === 0) {
      setNotification({
        message: "Selectează cel puțin o companie.",
        type: "error",
      });
      return;
    }

    if (!selectedTemplate) {
      setNotification({
        message: "Selectează un template de email.",
        type: "error",
      });
      return;
    }

    try {
      setSendingEmails(true);
      await emailService.sendEmails({
        companyIds: selectedCompanyIds,
        emailTemplateId: selectedTemplate.id,
      });

      setNotification({
        message: `Au fost trimise ${selectedCompanyIds.length} email-uri.`,
        type: "success",
      });

      // Refresh data - THIS FIXES THE "Function not implemented" ERROR
      await fetchCompanies(currentPage, pageSize);
      setSelectedCompanyIds([]);
    } catch (err) {
      console.error("Failed to send emails", err);
      setNotification({
        message: "A apărut o eroare la trimiterea email-urilor.",
        type: "error",
      });
    } finally {
      setSendingEmails(false);
    }
  };

  return {
    companies,
    countries,
    selectedCompanyIds,
    selectedCountry,
    setSelectedCountry,
    positions,
    selectedPosition,
    setSelectedPosition,
    selectedTemplate,
    loadingData,
    loadingCompanies,
    loadingTemplate,
    sendingEmails,
    error,
    sortColumn,
    sortOrder,
    companyFilterMode,
    setCompanyFilterMode,
    filters,
    notification,
    currentPage,
    pageSize,
    totalItems,
    handleSort,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    handleToggleCompany,
    handleToggleAllCompanies,
    handleSendEmails,
    paginatedCompanies,
    selectedCompaniesCount,
    allCompaniesSelected
  };
};
