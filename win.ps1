$postParams = @{hostname='L11PAVA-99009';huid='p29smmemembnsd929299';ip='10.10.10.10';os='Windows 11';version='11.2022';uptime='42'}
Invoke-WebRequest -Uri http://localhost:3000/pcs -Method POST -Body $postParams