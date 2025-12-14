// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::ffi::OsString;
use std::mem;
use std::os::windows::ffi::OsStringExt;
use windows::{
    Win32::Foundation::CloseHandle,
    Win32::NetworkManagement::IpHelper::{
        GetExtendedTcpTable, MIB_TCP6ROW_OWNER_PID, MIB_TCP6TABLE_OWNER_PID, MIB_TCPROW_OWNER_PID,
        MIB_TCPTABLE_OWNER_PID, TCP_TABLE_OWNER_PID_ALL,
    },
    Win32::System::ProcessStatus::GetModuleFileNameExW,
    Win32::System::Threading::{
        OpenProcess, TerminateProcess, PROCESS_QUERY_INFORMATION, PROCESS_TERMINATE,
        PROCESS_VM_READ,
    },
};

#[derive(serde::Serialize)]
struct PortInfo {
    port: u16,
    pid: u32,
    process_name: String,
    process_path: String,
}

/// Get the process path from a PID
fn get_process_path(pid: u32) -> String {
    unsafe {
        let handle = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, false, pid);

        if handle.is_err() {
            return String::new();
        }

        let handle = handle.unwrap();
        let mut buffer = vec![0u16; 260]; // MAX_PATH

        let result = GetModuleFileNameExW(handle, None, &mut buffer);
        CloseHandle(handle).ok();

        if result == 0 {
            return String::new();
        }

        // Convert to string, removing null terminator
        let len = buffer.iter().position(|&x| x == 0).unwrap_or(buffer.len());
        buffer.truncate(len);

        let os_string = OsString::from_wide(&buffer);
        os_string.to_string_lossy().to_string()
    }
}

/// Convert port from network byte order to host byte order
fn ntohs(port: u16) -> u16 {
    u16::from_be(port)
}

/// Get IPv4 listening ports
fn get_ipv4_ports() -> Result<Vec<PortInfo>, String> {
    unsafe {
        let mut size: u32 = 0;

        // First call to get required buffer size
        let result = GetExtendedTcpTable(
            None,
            &mut size,
            false,
            windows::Win32::Networking::WinSock::AF_INET.0 as u32,
            TCP_TABLE_OWNER_PID_ALL,
            0,
        );

        // ERROR_INSUFFICIENT_BUFFER = 122
        // This error is expected on first call
        if result != 122 {
            // If no IPv4 ports, return empty vector instead of error
            if result == 0 {
                return Ok(Vec::new());
            }
            return Err(format!("Failed to get IPv4 buffer size: {}", result));
        }

        // Allocate buffer
        let mut buffer = vec![0u8; size as usize];

        // Second call to get actual data
        let result = GetExtendedTcpTable(
            Some(buffer.as_mut_ptr() as *mut _),
            &mut size,
            false,
            windows::Win32::Networking::WinSock::AF_INET.0 as u32,
            TCP_TABLE_OWNER_PID_ALL,
            0,
        );

        // Check if successful (ERROR_SUCCESS = 0)
        if result != 0 {
            return Err(format!("Failed to get IPv4 TCP table: {}", result));
        }

        // Cast buffer to TCP table structure
        let table = &*(buffer.as_ptr() as *const MIB_TCPTABLE_OWNER_PID);

        let mut ports = Vec::new();

        // Calculate offset to first entry
        let table_ptr = buffer.as_ptr() as *const u8;
        let row_size = mem::size_of::<MIB_TCPROW_OWNER_PID>();
        let table_header_size = mem::size_of::<u32>(); // Size of dwNumEntries

        // Iterate through all rows using pointer arithmetic
        for i in 0..table.dwNumEntries {
            // Calculate offset: header size + (i * row_size)
            let row_offset = table_header_size + (i as usize * row_size);
            let row_ptr = table_ptr.add(row_offset) as *const MIB_TCPROW_OWNER_PID;
            let row = &*row_ptr;

            // Filter for LISTENING state (state = 2)
            // MIB_TCP_STATE_LISTEN = 2
            if row.dwState == 2 {
                let port = ntohs((row.dwLocalPort & 0xFFFF) as u16);
                let pid = row.dwOwningPid;
                let process_path = get_process_path(pid);
                let process_name = if process_path.is_empty() {
                    format!("PID {}", pid)
                } else {
                    process_path
                        .split('\\')
                        .last()
                        .unwrap_or("Unknown")
                        .to_string()
                };

                ports.push(PortInfo {
                    port,
                    pid,
                    process_name,
                    process_path,
                });
            }
        }

        Ok(ports)
    }
}

/// Get IPv6 listening ports
fn get_ipv6_ports() -> Result<Vec<PortInfo>, String> {
    unsafe {
        let mut size: u32 = 0;

        // First call to get required buffer size
        let result = GetExtendedTcpTable(
            None,
            &mut size,
            false,
            windows::Win32::Networking::WinSock::AF_INET6.0 as u32,
            TCP_TABLE_OWNER_PID_ALL,
            0,
        );

        // ERROR_INSUFFICIENT_BUFFER = 122
        // This error is expected on first call
        if result != 122 {
            // If no IPv6 ports, return empty vector instead of error
            if result == 0 {
                return Ok(Vec::new());
            }
            return Err(format!("Failed to get IPv6 buffer size: {}", result));
        }

        // Allocate buffer
        let mut buffer = vec![0u8; size as usize];

        // Second call to get actual data
        let result = GetExtendedTcpTable(
            Some(buffer.as_mut_ptr() as *mut _),
            &mut size,
            false,
            windows::Win32::Networking::WinSock::AF_INET6.0 as u32,
            TCP_TABLE_OWNER_PID_ALL,
            0,
        );

        // Check if successful (ERROR_SUCCESS = 0)
        if result != 0 {
            return Err(format!("Failed to get IPv6 TCP table: {}", result));
        }

        // Cast buffer to TCP6 table structure
        let table = &*(buffer.as_ptr() as *const MIB_TCP6TABLE_OWNER_PID);

        let mut ports = Vec::new();

        // Calculate offset to first entry
        let table_ptr = buffer.as_ptr() as *const u8;
        let row_size = mem::size_of::<MIB_TCP6ROW_OWNER_PID>();
        let table_header_size = mem::size_of::<u32>(); // Size of dwNumEntries

        // Iterate through all rows using pointer arithmetic
        for i in 0..table.dwNumEntries {
            // Calculate offset: header size + (i * row_size)
            let row_offset = table_header_size + (i as usize * row_size);
            let row_ptr = table_ptr.add(row_offset) as *const MIB_TCP6ROW_OWNER_PID;
            let row = &*row_ptr;

            // Filter for LISTENING state (state = 2)
            // MIB_TCP_STATE_LISTEN = 2
            if row.dwState == 2 {
                let port = ntohs((row.dwLocalPort & 0xFFFF) as u16);
                let pid = row.dwOwningPid;
                let process_path = get_process_path(pid);
                let process_name = if process_path.is_empty() {
                    format!("PID {}", pid)
                } else {
                    process_path
                        .split('\\')
                        .last()
                        .unwrap_or("Unknown")
                        .to_string()
                };

                ports.push(PortInfo {
                    port,
                    pid,
                    process_name,
                    process_path,
                });
            }
        }

        Ok(ports)
    }
}

/// List all TCP ports in LISTENING state (both IPv4 and IPv6)
#[tauri::command]
fn list_listening_ports() -> Result<Vec<PortInfo>, String> {
    // Get both IPv4 and IPv6 ports
    let mut ipv4_ports = get_ipv4_ports().unwrap_or_default();
    let mut ipv6_ports = get_ipv6_ports().unwrap_or_default();

    // Combine both lists
    let mut all_ports = Vec::new();
    all_ports.append(&mut ipv4_ports);
    all_ports.append(&mut ipv6_ports);

    // Remove duplicates (same port and PID)
    all_ports.sort_by_key(|p| (p.port, p.pid));
    all_ports.dedup_by(|a, b| a.port == b.port && a.pid == b.pid);

    // Sort by port number
    all_ports.sort_by_key(|p| p.port);

    Ok(all_ports)
}

/// Kill a process by PID
#[tauri::command]
fn kill_process(pid: u32) -> Result<(), String> {
    unsafe {
        // Open process with terminate access
        let handle = OpenProcess(PROCESS_TERMINATE, false, pid);

        match handle {
            Ok(handle) => {
                // Terminate the process
                let result = TerminateProcess(handle, 1); // Exit code 1
                CloseHandle(handle).ok();

                if result.is_err() {
                    let error = result.unwrap_err();
                    return Err(format!(
                        "Failed to terminate process {}: {}",
                        pid,
                        error.code().0
                    ));
                }

                Ok(())
            }
            Err(e) => {
                let error_code = e.code().0;

                // Common error codes
                if error_code == 5 {
                    // ERROR_ACCESS_DENIED
                    Err(format!(
                        "Access denied. Process {} may require Administrator privileges or may be a system process.",
                        pid
                    ))
                } else if error_code == 87 {
                    // ERROR_INVALID_PARAMETER
                    Err(format!("Invalid PID: {}", pid))
                } else {
                    Err(format!(
                        "Failed to open process {}: {} (Error code: {})",
                        pid,
                        e.to_string(),
                        error_code
                    ))
                }
            }
        }
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![list_listening_ports, kill_process])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
