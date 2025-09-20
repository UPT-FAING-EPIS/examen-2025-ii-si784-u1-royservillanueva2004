terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

# Configuración básica de variables
variable "location" {
  description = "Ubicación de los recursos de Azure"
  default     = "East US"
}

variable "db_admin" {
  description = "Administrador de la base de datos"
  default     = "examadmin"
}

# Crear un resource group
resource "azurerm_resource_group" "exam_rg" {
  name     = "online-exam-platform-rg"
  location = var.location
}

output "resource_group_name" {
  value = azurerm_resource_group.exam_rg.name
}