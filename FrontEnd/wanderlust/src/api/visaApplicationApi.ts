import { authenticatedFetch } from "../utils/api";

export interface VisaApplicationCreateDTO {
  country: string;
  fullName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  gender: string;
  maritalStatus: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  passportNumber: string;
  passportIssueDate: string;
  passportExpiryDate: string;
  passportIssuePlace: string;
  purposeOfTravel: string;
  departureDate: string;
  returnDate: string;
  accommodationAddress: string;
  occupation: string;
  companyName?: string;
  companyAddress?: string;
  monthlyIncome?: string;
  previousVisits: boolean;
  criminalRecord: boolean;
  healthIssues: boolean;
  additionalNotes?: string;
}

export interface VisaApplicationDTO extends VisaApplicationCreateDTO {
  id: string;
  userId: string;
  status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "DOCUMENTS_REQUIRED";
  submissionDate: string;
  reviewedBy?: string;
  reviewedDate?: string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VisaApplicationStatusDTO {
  status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "DOCUMENTS_REQUIRED";
  reviewNotes?: string;
}

export const visaApplicationApi = {
  // POST /api/visa-applications - Create new visa application
  createApplication: async (data: VisaApplicationCreateDTO): Promise<VisaApplicationDTO> => {
    const response = await authenticatedFetch("/api/visa-applications", {
      method: "POST",
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error("Không thể tạo hồ sơ visa");
    }
    
    return response.json();
  },

  // GET /api/visa-applications - Get my applications
  getMyApplications: async (): Promise<VisaApplicationDTO[]> => {
    const response = await authenticatedFetch("/api/visa-applications");
    
    if (!response.ok) {
      throw new Error("Không thể tải danh sách hồ sơ");
    }
    
    return response.json();
  },

  // GET /api/visa-applications/{id} - Get application by ID
  getApplicationById: async (id: string): Promise<VisaApplicationDTO> => {
    const response = await authenticatedFetch(`/api/visa-applications/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Không tìm thấy hồ sơ");
      }
      throw new Error("Không thể tải thông tin hồ sơ");
    }
    
    return response.json();
  },

  // PUT /api/visa-applications/{id}/status - Update status (Admin only)
  updateStatus: async (
    id: string,
    statusData: VisaApplicationStatusDTO
  ): Promise<VisaApplicationDTO> => {
    const response = await authenticatedFetch(`/api/visa-applications/${id}/status`, {
      method: "PUT",
      body: JSON.stringify(statusData),
    });
    
    if (!response.ok) {
      throw new Error("Không thể cập nhật trạng thái hồ sơ");
    }
    
    return response.json();
  },
};
